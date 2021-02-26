const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let totalUrls = null;
let churchArray = [];

function getUrls(html) {
	const $ = cheerio.load(html);
	const table = $('#myList');
	const congUrl = [];

	table
		.children()
		.last()
		.children()
		.each((i, el) => {
			const url = $(el).children().first().find('a').attr('href');
			congUrl.push(url);
		});
	return congUrl;
}

function scrapeCong(html) {
	const $ = cheerio.load(html);
	const body = $('body');
	const name = body.children().first().text().trim();
	const address = body
		.children()
		.first()
		.next()
		.children()
		.first()
		.html()
		.replace(/<strong\s*\/?>/g, '')
		.replace(/<\/strong\s*\/?>/g, '')
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/\s\s+/g, ' ')
		.replace(/^Address/g, '')
		.trim();

	const pastor = body
		.children()
		.first()
		.next()
		.children()
		.first()
		.next()
		.next()
		.find('br')[0]
		.nextSibling
        .nodeValue
        .replace(/\(.*/g, '')
		.replace(/Minister:/g, '')
		.trim();

	const phone = body
		.children()
		.first()
		.next()
		.children()
		.first()
		.next()
		.next()
		.find('br')[2]
		.nextSibling
        .nodeValue
        .trim()
		.replace(/([^\s]+)/m, '')
		.trim();

    const email = body
		.children()
		.first()
		.next()
		.children()
		.first()
		.next()
		.next()
        .find('a')
        .first()
        .text()

    const website = body
		.children()
		.first()
		.next()
		.children()
		.first()
		.next()
		.next()
        .find('a')
        .last()
        .attr('href')
	

    cong = {
        id: uuidv4(),
        name: name,
        denom: 'URCNA',
        address: address,
        pastor: pastor,
        phone: phone,
        email: email,
        website: website,
    }

	return cong;
}

async function fetchPage(url) {
    
	try {
		const page = await fetch(
			`https://www.urcna.org/sysfiles/member/family/${url}`
		);
		const html = await page.text();
		const congScraped = scrapeCong(html);
		churchArray.push(congScraped);
        console.log(congScraped)
        console.log(churchArray.length)
	} catch {
		(error) => console.log(error);
	}

    if(churchArray.length > 115){
        const urcna = JSON.stringify(churchArray)
        fs.writeFileSync('../../frontend/src/api/urcna.json', urcna);
	    console.log('Created json');
    }
}

async function fetchUrl() {
	try {
		const page = await fetch(
			'https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1'
		);
		const html = await page.text();
		const scraped = getUrls(html);
        totalUrls = scraped.length;
		console.log(totalUrls)
		scraped.forEach((url) => {
			fetchPage(url);
		});
	} catch {
		(error) => console.log(error);
	}
}

fetchUrl();
