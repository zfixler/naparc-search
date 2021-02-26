const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

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

		const cong = {
			id: uuidv4(),
            denom: 'PRC',
			name: name,
			pastor: pastor,
			address: address,
            phone: phone,
            email: email,
            website: url
		};

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
	const prc = JSON.stringify(data)
    fs.writeFileSync('../../frontend/src/api/prc.json', prc);
	console.log('Created json');
}

getUrls().catch((error) => console.log(error));
