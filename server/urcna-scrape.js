const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

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

function scrapeCong(url) {

	const decoded = decodeURIComponent(url);
	const congArr = decoded.split('&')

	const name = congArr.find(str => str.includes('church')).replace(/.*=/g, '')
	const pastor = congArr.find(str => str.includes('min1')).replace(/.*=/g, '')
	const addr = congArr.find(str => str.includes('addr')).replace(/.*=/g, '')
	const city = congArr.find(str => str.includes('city')).replace(/.*=/g, '')
	const state = congArr.find(str => str.includes('state')).replace(/.*=/g, '')
	const zip = congArr.find(str => str.includes('zip')).replace(/.*=/g, '')
	const address = `${addr} ${city}, ${state} ${zip}` 
	const phone = congArr.find(str => str .includes('phone')).replace(/.*=/g, '')
	const email = congArr.find(str => str.includes('email')).replace(/.*=/g, '')
	const website = congArr.find(str => str.includes('web')).replace(/.*=/g, '')
	const long = congArr.find(str => str.includes('lng')).replace(/.*=/g, '')
	const lat = congArr.find(str => str .includes('lat')).replace(/.*=/g, '')

	const date = new Date();
	const update = `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}`;

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
		long: long,
		lat: lat,
	};
	return cong
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

		scraped.forEach((url) => {
			const cong = scrapeCong(url)
			churchArray.push(cong)

			if (churchArray.length === totalUrls) {
				const urcna = JSON.stringify(churchArray);
				fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `urcna.json`), urcna)
				console.log('URCNA JSON written.')
			}
		});

	} catch {
		(error) => console.log(error);
	}
}

exports.fetchUrl = fetchUrl





