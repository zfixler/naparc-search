const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

async function getPageUrls() {
	let urls = [`http://www.rcus.org/directory/congregations/`];

	const response = await fetch(`http://www.rcus.org/directory/congregations/`);
	const html = await response.text();

	const $ = cheerio.load(html);

	$('#cn-page-nav')
		.find('a')
		.each((i, el) => {
			let url = $(el).attr('href');
			if (!urls.includes(url)) {
				urls.push(url);
			}
		});

	return urls;
}

async function scrapeCongs() {
	const urls = await getPageUrls().catch((error) => console.log(error));
	const rcus = [];

	for await (url of urls) {
		const response = await fetch(url);
		const html = await response.text();
		const $ = cheerio.load(html);

		$('.cn-entry').each((i, el) => {
			const date = new Date();
			const update = `${
				date.getMonth() + 1
			}/${date.getDate()}/${date.getFullYear()}`;

			let congregation = {
				name: null,
				denom: 'RCUS',
				id: uuidv4(),
				pastor: null,
				address: null,
				phone: null,
				email: null,
				website: null,
				long: null,
				lat: null,
                date: update
			};

			$(el)
				.find('.cn-accordion-item')
				.each((i, el) => {
					if ($(el).text().includes('-')) {
						congregation.name = $(el)
							.text()
							.match(/[^-]*$/g)[0]
							.trim();
					} else if ($(el).text().includes('–')) {
						congregation.name = $(el)
							.text()
							.match(/[^–]*$/g)[0]
							.trim();
					} else {
						congregation.name = $(el).text().trim();
					}
				});

			congregation.pastor = $(el).find('.cn-contact-block').text();

			congregation.address = $(el)
				.find('.address-block')
				.children()
				.first()
				.text()
				.replace(/Church\sAddress/, '')
				.replace(/work/, '')
				.trim();

			congregation.phone = $(el)
				.find('.phone-number-block')
				.children()
				.first()
				.find('.value')
				.text();

			congregation.email = $(el)
				.find('.email-address-block')
				.children()
				.first()
				.find('.email-address')
				.text();

			congregation.website = $(el).find('.website').find('a').attr('href');

			rcus.push(congregation);
		});
	}

	for await (congregation of rcus) {
		if (
			congregation.address.match(/\d{5}/g) &&
			!congregation.address.match(/[A-Z]\d[A-Z]/g)
		) {
			const zip = congregation.address.match(/\d{5}/g)[0];
			const url = `http://api.zippopotam.us/us/${zip}`;

			const res = await fetch(url);
			const json = await res.json();

			if (json.places !== undefined) {
				const lat = await json.places[0].latitude;
				const long = await json.places[0].longitude;

				congregation.lat = lat;
				congregation.long = long;
			}
		} else if (congregation.address.match(/[A-Z]\d[A-Z]/g) !== null) {
			const zip = congregation.address.match(/[A-Z]\d[A-Z]/g)[0];
			const url = `http://api.zippopotam.us/CA/${zip}`;

			const res = await fetch(url);
			const json = await res.json();

			if (json.places !== undefined) {
				const lat = json.places[0].latitude;
				const long = json.places[0].longitude;

				congregation.lat = lat;
				congregation.long = long;
			}
		}

		console.log(congregation);
	}

	const data = JSON.stringify(rcus, null, 4);

		fs.writeFileSync(
			path.join(__dirname, '..', 'public', 'api', `rcus.json`),
			data
		);
		console.log('RCUS json written.');
}

scrapeCongs().catch((error) => console.log(error));
