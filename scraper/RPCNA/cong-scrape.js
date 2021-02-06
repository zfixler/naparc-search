const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const urlList = require('./url-list.json');
const { v4: uuidv4 } = require('uuid');

function getData(html) {
	const $ = cheerio.load(html);

	const el = $('.church_info');

	const congName = $(el).find('h1').text();

	const pastor = $(el).find('p').first().text();

	const phone = $(el)
		.find('table')
		.children()
		.children()
		.first()
		.children()
		.last()
		.text()
		.replace(/\s\s+/g, ' ');

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

	const congregation = {
		id: uuidv4(),
		name: congName,
		pastor: pastor,
		phone: phone,
		email: email,
		website: website,
		address: address,
	};
	console.log(churchArray.length)
	console.log(urlList.length)
	return congregation;
}

let churchArray = [];

async function createArray(url) {
	try {
		const res = await fetch(`${url}`);
		const text = await res.text();
		churchArray.push(getData(text));
	} catch {
		(error) => console.log(error);
	}

	
	if (churchArray.length === urlList.length) {
		const data = JSON.stringify(churchArray);
		fs.writeFileSync('../../frontend/src/api/rpcna.json', data);
		console.log('Created json');
	}
}

urlList.forEach((url) => {
	createArray(url);
});
