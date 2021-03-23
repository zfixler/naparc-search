const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

async function scrapeCong(arr) {
	const churchArray = [];
	for (const url of arr) {
		const page = await fetch(url);
		const html = await page.text();
		const $ = cheerio.load(html);

		const name = $('header > h1').text();
		const textWidget = $('div.textwidget')
			.html()
			.replace(/\n/g, '')
			.split('<br>');

		const pastor = textWidget
			.filter((item) => item.includes('Pastor'))
			.toString()
			.replace(/\,.*/g, '')
			.replace(/Pastor:/, '')
			.trim();

		const addressIndex = textWidget.findIndex(
			(i) => i.includes('Address') || i.includes('Location')
		);

		const addressString = `${textWidget[addressIndex + 1]} ${
			textWidget[addressIndex + 2]
		} ${textWidget[addressIndex + 3]} ${textWidget[addressIndex + 4]}`;

		const address = addressString
			.replace(/\(.*/g, '')
			.replace(/Phone:/, '')
			.replace(/\s\s+/g, '')
			.trim();

        const phone = textWidget
            .filter((item) => item.includes('Phone'))
            .toString()
            .replace(/[^0-9()-\s]/gm, '')
            .trim();
        
        const linkArray = $('div.textwidget')
			.text()
			.replace(/\n/g, ' ')
			.split(' ');

        const email = linkArray.filter(i => i.includes('@')).toString()

		const date = new Date();
		const update = `${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}`;

		const cong = {
			id: uuidv4(),
            denom: 'PRC',
			name: name,
			pastor: pastor,
			address: address,
            phone: phone,
            email: email,
            website: url,
			date: update
		};

		if (address.match(/[A-Z][0-9][A-Z]/g)) {
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
	return churchArray;
}

async function getUrls() {
	const page = await fetch('https://presbyterianreformed.org/');
	const html = await page.text();
	const $ = cheerio.load(html);
	const urlArray = [];

	$('#menu-item-62')
		.children()
		.last()
		.children()
		.each((i, el) => {
			urlArray.push($(el).find('a').attr('href'));
		});

	const data = await scrapeCong(urlArray);
	const pcc = JSON.stringify(data)
    fs.writeFileSync(path.join(__dirname, 'api', 'prc.json'), prc);
	console.log('Created json PRC');
}

exports.getUrls = getUrls
