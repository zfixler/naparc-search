const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function scrapeData(html) {
	const $ = cheerio.load(html);

	const main = $('main');

	const churchArray = [];

	main.find('article').each((i, el) => {
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
            .attr('href')

		const cong = {
            id: uuidv4(),
            denom: 'HRC',
			name: name,
			address: address,
            phone: phone,
            email: email,
            website: website
		};

		churchArray.push(cong);
	});

    return churchArray
}

async function fetchData() {
    try{
	const data = await fetch('https://heritagereformed.com/locations/');
	const html = await data.text();
	const congArray = scrapeData(html);
    const hrc = JSON.stringify(congArray)
    fs.writeFileSync('../../frontend/src/api/hrc.json', hrc);
	console.log('Created json');

    } catch {error => console.log(error)}
}

fetchData();
