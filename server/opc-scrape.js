const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

let totalHits = 0;
let churchArray = [];
let totalRejects = 0;

function writeJson(num1, num2) {
	// console.log(`Total hits: ${num1}. Total rejects: ${num2}.`);
	if (num1 + num2 === 525) {
		const data = JSON.stringify(churchArray);
		fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `opc.json`), data)
		console.log('OPC JSON written.')
	}
}

async function getURL(res) {
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

		const pastor = contact
			.next()
			.html()
			.replace(/\<.*/g, '')
			.replace(/Pastor:/, '')
			.trim();

		const email = contact.next().find('a').text();

		const phone = contact
			.next()
			.html()
			.replace(/^(.*?)<\/a>/, '')
			.replace(/<br\s*\/?>/gi, ' ')
			.replace(/^(.*?):/, '')
			.trim();

		let website = card.find('a').last().attr('href');

		website.includes('/locator.html?presbytery_id')
			? (website = 'http://www.opc.org')
			: website;

		const date = new Date();
		const update = `${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}`;

		const congregation = {
			id: uuidv4(),
			denom: 'OPC',
			name: name,
			pastor: pastor,
			phone: phone,
			email: email,
			website: website,
			address: address,
			date: update,
		};

		if (address.match(/[A-Z][0-9][A-Z]/g)) {
			const zip = address
				.match(/[A-Z]\d[A-Z]/g)
				.join()
				.trim();

			const url = `http://api.zippopotam.us/ca/${zip}`;

			const res = await fetch(url).catch(error => {
				if (error.code === 'ECONNRESET'){
					fetch(url).catch(error => console.log(error))
				} else { return {"places": null} }
			});
			const json = await res.json();
			if(json.places !== null){
				const lat = await json.places[0].latitude;
				const long = await json.places[0].longitude;
				congregation.lat = lat;
				congregation.long = long;
			}
			
		} else if (address.match(/\d{5}(?!.*\d{5})/g)) {
			const zip = address
				.match(/\d{5}(?!.*\d{5})/g)
				.join()
				.replace(/.*,/g, '')
				.trim();

			const url = `http://api.zippopotam.us/us/${zip}`;

			const res = await fetch(url).catch(error => {
				if (error.code === 'ECONNRESET'){
					fetch(url).catch(error => console.log(error))
				} else { return {"places": null}}
			});
			const json = await res.json();
			if(json.places !== null){
				const lat = await json.places[0].latitude;
				const long = await json.places[0].longitude;
				congregation.lat = lat;
				congregation.long = long;
			}
		}

		totalHits += 1;
		writeJson(totalHits, totalRejects);
		return congregation;
	} else {
		totalRejects += 1;
		writeJson(totalHits, totalRejects);
	}
}

async function scrapeOpc() {
	const urlList = []
	for (let i = 0; i < 550; i++) {
		urlList.push(`https://opc.org/church.html?church_id=${i}`)
		// fetch(`https://opc.org/church.html?church_id=${i}`)
		// 	.then((res) => res.text())
		// 	.then((html) => getURL(html))
		// 	.then((data) => churchArray.push(data))
		// 	.catch((error) => console.log(error));
	}

	for await (url of urlList){
		const page = await fetch(url).catch(error => {
			if (error.code === 'ECONNRESET'){
				fetch(url).catch(error => console.log(error))
			} else { console.log(error)}
		})
		const html = await page.text()
		const cong = await getURL(html)
		if(cong !== undefined){
			churchArray.push(cong)
		}
	}
}

scrapeOpc().catch(error => console.log(error))
