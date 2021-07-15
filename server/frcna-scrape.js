const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

function getUrlList(html) {
	const $ = cheerio.load(html);

	const urlArray = [];

	$('h3').each((i, el) => {
		const url = $(el).children().attr('href');
		urlArray.push(url);
	});

	return urlArray;
}

async function scrapeCong(html, url) {
	try {
		const $ = cheerio.load(html);

		const info = $('.itemExtraFields');

		const date = new Date();
		const update = `${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}`;

		let congregation = {
			id: uuidv4(),
			denom: 'FRCNA',
			name: null,
			pastor: null,
			address: null,
			phone: null,
			website: null,
			email: null,
			long: null,
			lat: null,
			date: update
		};

		congregation.name = $('h2').text().trim();

		info.find('span').each((i, el) => {
			if ($(el).text().includes('Minister')) {
				congregation.pastor = $(el).next().text().trim();
			} else if (
				$(el).html().includes('Address') &&
				congregation.address === null
			) {
				congregation.address = $(el)
					.next()
					.html()
					.replace(/\n/g, '')
					.replace(/<p>*/g, '')
					.replace(/<\/p>*/g, '')
					.replace(/<br>*/g, ' ')
					.replace(/<.*/g, '')
					.replace(/&nbsp/g, '')
					.replace(/Tel:(.*)/g, '')
					.replace(/Bulletin:(.*)/g, '')
					.replace(/\(\d\d\d\)(.*)/g, '')
					.replace(/\s\s+/g, ' ')
					.trim();
			} else if ($(el).text().includes('Website')) {
				congregation.website = $(el).next().text();
			} else if (congregation.website === null) {
				congregation.website = `https://www.frcna.org${url}`;
			}
		});

		info.find('span').each((i, el) => {
			if (
				$(el)
					.html()
					.match(/[(]?[0-9]{3}[)][ ][0-9]{3}[-][0-9]{4}/)
			) {
				congregation.phone = $(el)
					.html()
					.match(/[(]?[0-9]{3}[)][ ][0-9]{3}[-][0-9]{4}/g)[0];
			} else if (
				$(el)
					.html()
					.match(/[[0-9]{3}[-][0-9]{3}[-][0-9]{4}/)
			) {
				congregation.phone = $(el)
					.html()
					.match(/[[0-9]{3}[-][0-9]{3}[-][0-9]{4}/)[0];
			} else if (
				$(el)
					.html()
					.match(/[[0-9]{3}[ ][0-9]{3}[-][0-9]{4}/)
			) {
				congregation.phone = $(el)
					.html()
					.match(/[[0-9]{3}[ ][0-9]{3}[-][0-9]{4}/)[0];
			} else {
				return null;
			}
		});

		if (
			congregation.address.match(/\d{5}/g) &&
			!congregation.address.match(/[A-Z]\d[A-Z]/g)
		) {
			const zip = congregation.address.match(/\d{5}/g)[0];
			const url = `http://api.zippopotam.us/us/${zip}`;

			const res = await fetch(url);
			const json = await res.json();

			const lat = await json.places[0].latitude;
			const long = await json.places[0].longitude;

			congregation.lat = lat;
			congregation.long = long;
		} else if (congregation.address.match(/[A-Z]\d[A-Z]/g) !== null) {
			const zip = congregation.address.match(/[A-Z]\d[A-Z]/g)[0];
			const url = `http://api.zippopotam.us/CA/${zip}`;

			const res = await fetch(url);
			const json = await res.json();

			const lat = await json.places[0].latitude;
			const long = await json.places[0].longitude;

			congregation.lat = lat;
			congregation.long = long;
		}

		return congregation;
	} catch {
		(error) => console.log(error);
	}
}

async function scrapeFrcna() {
	let frcna = [];

	try {
		const response = await fetch(
			'https://frcna.org/component/k2/itemlist/category/5'
		);
		const html = await response.text();
		const urlList = await getUrlList(html);

		for await (url of urlList) {
			const response = await fetch(`https://www.frcna.org${url}`);
			const html = await response.text();
			const cong = await scrapeCong(html, url);
			console.log(cong);

			if (cong.lat !== null) {
				frcna.push(cong);
			}
		}

		const data = JSON.stringify(frcna, null, 4);

		fs.writeFileSync(
			path.join(__dirname, '..', 'public', 'api', `frcna.json`),
			data
		);
		console.log('FRCNA JSON written.');
	} catch {
		(error) => console.log(error);
	}
}

scrapeFrcna();
