const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

function presbyteries(html) {
	const $ = cheerio.load(html);
	const urls = [];

	$('ul')
		.children()
		.each((i, el) => {
			let url = $(el).children().attr('href');
			if (url !== undefined && url.includes('category')) {
				urls.push(url);
			}
		});

	return urls;
}

function congregations(html) {
	const $ = cheerio.load(html);
	const urls = [];
	$('tbody')
		.children()
		.each((i, el) => {
			const url = $(el).find('a').attr('href');
			if (url !== undefined && !url.includes('@')) {
				urls.push(url);
			}
		});
	return urls;
}

async function scrapeCong(url) {
	const resp = await fetch(url);
	const html = await resp.text();
	const $ = cheerio.load(html);

	let phone = '';
	let email = '';
	let website = '';
	let pastor = '';

	$('.church_info')
		.find('th')
		.each((i, el) => {
			const content = $(el).text();
			if (content.includes('Phone')) {
				phone = $(el).next().text().trim();
			} else if (content.includes('Email')) {
				email = $(el).next().children().text().trim();
			} else if (content.includes('Web')) {
				website = $(el).next().children().attr('href');
			}
		});

	$('.church_info')
		.find('p')
		.each((i, el) => {
			if ($(el).text().includes('Pastor')) {
				pastor = $(el).text().replace(/,.*/g, '').trim();
			} else if ($(el).text().includes('Contact')) {
				pastor = $(el).text().trim();
			}
		});

	const address = $('[name=daddr]')
		.attr('value')
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/\s\s+/g, ' ')
		.replace(/.\s,/g, '.,')
		.trim();

	const name = $('.church_info').find('h1').html().replace(/\<.*/g, '').trim();

	const date = new Date();
	const update = `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}`;

	const congregation = {
		id: uuidv4(),
		name: name,
		denom: 'RPCNA',
		phone: phone,
		emai: email,
		website: website,
		pastor: pastor,
		address: address,
		date: update,
	};

	if (address.match(/\d{5}(?!.*\d{5})/g) !== null) {
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

		congregation.lat = lat;
		congregation.long = long;
	} else if (address.match(/[A-Z]\d[A-Z]/g) !== null) {
		const zip = address
			.match(/[A-Z]\d[A-Z](?!.*[A-Z]\d[A-Z])/g)
			.join()
			.replace(/.*,/g, '')
			.trim();

		const url = `http://api.zippopotam.us/CA/${zip}`;

		const res = await fetch(url);
		const json = await res.json();

		const lat = await json.places[0].latitude;
		const long = await json.places[0].longitude;

		congregation.lat = lat;
		congregation.long = long;
	}

	return congregation;
}

async function scrapeRpcna() {
	const response = await fetch('https://rpcna.org/trunk/page/congregations');
	const html = await response.text();
	const presbyteryUrlList = presbyteries(html);

	const allUrls = [];

	for await (presb of presbyteryUrlList) {
		const response = await fetch(presb);
		const html = await response.text();
		const congUrls = congregations(html);
		allUrls.push(congUrls);
	}

	const rpcna = [];
	let count = 0;

	for await (url of allUrls.flat()) {
		const cong = await scrapeCong(url).catch((error) => console.log(error));
		rpcna.push(cong);
		console.log(`${count + 1} congregations scraped.`);
		count++;
	}

	const data = JSON.stringify(rpcna);
	fs.writeFileSync(
		path.join(__dirname, '..', 'public', 'api', `rpcna.json`),
		data
	);
	console.log('RPCNA JSON written.');
}

scrapeRpcna().catch((error) => console.log(error));
