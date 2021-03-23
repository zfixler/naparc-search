const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const urlList = []

async function getData(html) {
	const $ = cheerio.load(html);

	const el = $('.church_info');

	const congName = $(el).find('h1').html().replace(/\<.*/g, '').trim();

	const pastor = $(el).find('p').first().text().replace(/,.*/g, '').trim();

	const phone = $(el)
		.find('table')
		.children()
		.children()
		.first()
		.children()
		.last()
		.text()
		.replace(/\s\s+/g, ' ')
		.trim();

	const email = $(el)
		.find('table')
		.children()
		.children()
		.first()
		.next()
		.children()
		.last()
		.children()
		.text()
		.replace(/\s\s+/g, ' ');

	const website = $(el)
		.find('table')
		.children()
		.children()
		.first()
		.next()
		.next()
		.children()
		.last()
		.children()
		.first()
		.attr('href');

	const address = $('.address')
		.find('p')
		.first()
		.html()
		.replace(/\s\s+/g, ' ')
		.replace(/<br\s*\/?>/gi, ' ');

	const date = new Date()
	const update = `${date.getMonth() +1}/${date.getDate()}/${date.getFullYear()}`


	const congregation = {
		id: uuidv4(),
		denom: 'RPCNA',
		name: congName,
		pastor: pastor,
		phone: phone,
		email: email,
		website: website,
		address: address,
		date: update
	};

	if(address.match(/\d{5}(?!.*\d{5})/g) !== null){
		const zip = address.match(/\d{5}(?!.*\d{5})/g).join().replace(/.*,/g, '').trim()
		const url = `http://api.zippopotam.us/us/${zip}`
			
		const res = await fetch(url)
		const json = await res.json()
		
		const lat = await json.places[0].latitude
		const long = await json.places[0].longitude

		congregation.lat = lat
		congregation.long = long

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

	// console.log(`${churchArray.length} of ${urlList.length} scraped.`);


	return congregation;
}

let churchArray = [];

async function createArray(url) {
	try {
		const res = await fetch(`${url}`);
		const text = await res.text();
		churchArray.push(await getData(text).catch(error => console.log(error)));
	} catch {
		(error) => console.log(error);
	}

	if (churchArray.length === urlList.length) {
		const filteredArray = churchArray.filter(
			(cong) => cong !== null || undefined
		);
		const data = JSON.stringify(filteredArray);
		fs.writeFileSync(path.join(__dirname, '..', 'api', 'rpcna.json'), data);
		console.log('Created json rpcna');
	}
}

async function getURL() {
	const page = await fetch('https://reformedpresbyterian.org/congregations/list/category/usa')
	const html = await page.text()
	
	const $ = cheerio.load(html);
	

	$('.church_directory table tbody tr').each((i, el) => {
		const churchURL = $(el).find('a').first().attr('href');
		urlList.push(churchURL);
	});

	urlList.forEach((url) => {
		createArray(url);
	});
}

exports.getURL = getURL
