const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

let totalHits = 0;
let churchArray = [];
let totalRejects = 0;

function writeJson(num1, num2) {
	console.log(`Total hits: ${num1}. Total rejects: ${num2}.`);

	if (num1 + num2 === 599) {
		const data = JSON.stringify(churchArray);
		fs.writeFileSync('../../frontend/src/api/opc.json', data);
		console.log('JSON Created');
	}
}

function getURL(res) {
	const $ = cheerio.load(res);

	if ($('.churchCard').length === 1) {
		const card = $('.churchCard');

		const name = card
			.find('.churchdirhead')
			.first()
			.children()
			.text()
			.replace(/\-.*/g, '')
			.replace(/\s\s+/g, '')
			.toLowerCase()
			.trim();

		const address = card
			.find('p')
			.first()
			.html()
			.replace(/<br\s*\/?>/gi, ' ')
			.trim();

		const contact = card.find('h4').filter(function () {
			return $(this).text().trim() === 'Contact Information';
		});

		const pastor = contact.next().html().replace(/\<.*/g, '');

		const email = contact.next().find('a').text();

		const phone = contact
			.next()
			.html()
			.replace(/^(.*?)<\/a>/, '')
			.replace(/<br\s*\/?>/gi, ' ')
			.replace(/^(.*?):/, '')
			.trim();

		const website = card.find('a').last().attr('href');

		const congregation = {
			id: uuidv4(),
			denom: 'OPC',
			name: name,
			pastor: pastor,
			phone: phone,
			email: email,
			website: website,
			address: address,
		};
		totalHits += 1;
		writeJson(totalHits, totalRejects);
		console.log(congregation);
		return congregation;
	} else {
		totalRejects += 1;
		writeJson(totalHits, totalRejects);
		console.log('Nada');
	}
}

function scrapeData() {
	for (let i = 0; i < 600; i++) {
		fetch(`https://opc.org/church.html?church_id=${i}`)
			.then((res) => res.text())
			.then((html) => getURL(html))
			.then((data) => churchArray.push(data))
			.catch((error) => console.log(error));
	}
}

scrapeData();
