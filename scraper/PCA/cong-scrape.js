const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const pca = [];
let count = 0;

async function getLongLat(city, state) {
	const page = await fetch(`https://stat.pcanet.org/ac/directory/${href}`);
	const html = await page.text();
	const $ = cheerio.load(html);

	return $('textarea').text();
}

async function scrapePage(html) {
	const $ = cheerio.load(html);
	const congArr = [];

	$('.formtableleft').each((i, el) => {
		const name = $(el).children().text();
		const phone = $(el).siblings().first().next().next().next().next().text();
		const website = $(el)
			.siblings()
			.first()
			.next()
			.next()
			.next()
			.next()
			.next()
			.next()
			.children()
			.text();
		const email = $(el)
			.siblings()
			.first()
			.next()
			.next()
			.next()
			.next()
			.next()
			.children()
			.text();
		const pastor = $(el).siblings().last().text();

		const city = $(el).next().text().toLowerCase();
		const state = $(el).next().next().text().toLowerCase();

		const date = new Date();
		const update = `Updated on ${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}.`;

		const cong = {
			id: uuidv4(),
			name: name,
			phone: phone,
			pastor: pastor,
			email: email,
			website: website,
			address: `${city}, ${state}`,
			city: city,
			state: state,
			date: update,
            denom: 'PCA'
		};

		congArr.push(cong);
	});

	return congArr;
}

async function getStateOptions() {
	const page = await fetch(
		'https://stat.pcanet.org/ac/directory/directory.cfm'
	);
	const html = await page.text();

	const $ = cheerio.load(html);

	const stateSelectorArray = [];

	$('#State')
		.children()
		.each((i, el) => {
			stateSelectorArray.push($(el).attr('value'));
		});
    count = stateSelectorArray.length
	return stateSelectorArray;
}

async function fetchPage(url, data) {
	const page = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: data,
	});

	return await page.text();
}

async function getPages() {
	const states = await getStateOptions().catch((error) => console.log(error));
  
    for await (state of states) {
		if (state !== 'Select State') {
			const data = `State=${state}&orderby=1`;
			const url = 'https://stat.pcanet.org/ac/directory/directory.cfm';
			const html = await fetchPage(url, data);
			const stateCongs = await scrapePage(html).catch((error) =>
				console.log(error)
			);
            
			pca.push(stateCongs);
            console.log(`${Math.round(pca.length / (count -1) * 100)}%`)
		}
	}
    if(pca.length === (count - 1)){
        const data = JSON.stringify(pca)
        fs.writeFileSync('../../frontend/src/api/pca.json', data);
        console.log('Created json');
    }
}

getPages().catch((error) => console.log(error));
