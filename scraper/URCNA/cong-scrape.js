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

async function scrapeCong(html) {
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
		.nextSibling.nodeValue.replace(/\(.*/g, '')
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
		.nextSibling.nodeValue.trim()
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
		.text();

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
		.attr('href');

	const date = new Date();
	const update = `Updated on ${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}.`;

	cong = {
		id: uuidv4(),
		name: name,
		denom: 'URCNA',
		address: address,
		pastor: pastor,
		phone: phone,
		email: email,
		website: website,
		date: update,
	};

	if (address.match(/[A-Z][0-9][A-Z]/g)){
		const zip = address
			.match(/[A-Z]\d[A-Z]/g)
			.join()
			.trim();

		const url = `http://api.zippopotam.us/CA/${zip}`;

		const res = await fetch(url);
		const json = await res.json();

		const lat = await json.places[0].latitude;
		const long = await json.places[0].longitude;

		cong.lat = lat;
		cong.long = long;

	} else if (address.match(/\d{5}(?!.*\d{5})/g)) {
		const zip = address
			.match(/\d{5}(?!.*\d{5})/g)
			.join()
			.replace(/.*,/g, '')
			.trim();

		const url = `http://api.zippopotam.us/us/${zip}`;

		const res = await fetch(url);
		const json = await res.json();

		const lat = await json.places[0].latitude;
		const long = await json.places[0].longitude;

		cong.lat = lat;
		cong.long = long;
	}

	churchArray.push(cong);
}

async function fetchPage(url) {
	try {
		const page = await fetch(
			`https://www.urcna.org/sysfiles/member/family/${url}`
		);
		const html = await page.text();
		await scrapeCong(html).catch((error) =>
			console.log(error)
		);
		
	} catch {
		(error) => console.log(error);
	}

	if (churchArray.length > 115) {
		const urcna = JSON.stringify(churchArray);
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
		console.log(totalUrls);
		for await (url of scraped){
			fetchPage(url);
		};
	} catch {
		(error) => console.log(error);
	}
}

fetchUrl();
