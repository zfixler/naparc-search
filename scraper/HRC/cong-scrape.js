const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function scrapeData(html) {
	const $ = cheerio.load(html);

	const main = $('main');

	const churchArray = [];

	main.find('article').each(async (i, el) => {
		const name = $(el)
			.children()
			.first()
			.children()
			.last()
			.children()
			.first()
			.html()
			.trim()
			.replace(/\,.*/, '');
		const address = $(el)
			.children()
			.first()
			.children()
			.last()
			.children()
			.first()
			.html()
			.trim()
			.replace(/([^,]+)/, '')
			.replace(/(?:\s,)/, '')
			.replace(/(?:,)/, '')
			.trim();

        const phone = $(el)
			.children()
			.first()
			.children()
			.last()
			.children()
			.first()
            .next()
            .text()
            .trim()

        const email = $(el)
			.children()
			.first()
			.children()
			.last()
			.children()
			.first()
            .next()
            .next()
            .children()
            .text()
            .trim()

        const website = $(el)
            .children()
            .last()
            .children()
            .children()
            .first()
            .children()
            .attr('href');

		const date = new Date();
		const update = `Updated on ${
				date.getMonth() + 1
			}/${date.getDate()}/${date.getFullYear()}.`;

		const cong = {
            id: uuidv4(),
            denom: 'HRC',
			name: name,
			address: address,
            phone: phone,
            email: email,
            website: website,
			date: update
		};
		churchArray.push(cong);
	});

    return churchArray
}

async function fetchData() {
	const data = await fetch('https://heritagereformed.com/locations/');
	const html = await data.text();
	const congArray = await scrapeData(html);
	return congArray
}

async function getLongLat(){
		const data = await fetchData().catch(error => console.log(error));

		for await (let item of data){
	
			if (item.address.match(/[A-Z][0-9][A-Z]/g)) {
				const zip = item.address
					.match(/[A-Z]\d[A-Z]/g)
					.join()
					.trim();

				const url = `http://api.zippopotam.us/CA/${zip}`;

				const res = await fetch(url);
				const json = await res.json();

				const lat = await json.places[0].latitude;
				const long = await json.places[0].longitude;

				item.lat = lat;
				item.long = long;

			} else if (item.address.match(/\d{5}(?!.*\d{5})/g)) {
				const zip = item.address
					.match(/\d{5}(?!.*\d{5})/g)
					.join()
					.replace(/.*,/g, '')
					.trim();

				const url = `http://api.zippopotam.us/us/${zip}`;

				const res = await fetch(url);
				const json = await res.json();

				const lat = await json.places[0].latitude;
				const long = await json.places[0].longitude;

				item.lat = lat;
				item.long = long;
			}

		} 

    const hrc = JSON.stringify(data)
    fs.writeFileSync('../../frontend/src/api/hrc.json', hrc);
	console.log('Created json');
}

getLongLat().catch(error => console.log(error))
