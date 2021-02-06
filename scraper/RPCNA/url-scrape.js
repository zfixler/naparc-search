const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');

function getURL(res) {
	const $ = cheerio.load(res);
	const data = [];

	$('.church_directory table tbody tr').each((i, el) => {
		const churchURL = $(el).find('a').first().attr('href');

		data.push(churchURL);
	});

	return data;
}

fetch('https://reformedpresbyterian.org/congregations/list/category/usa')
	.then((res) => res.text())
	.then((html) => getURL(html))
	.then((data) => JSON.stringify(data))
	.then((json) => fs.writeFileSync('url-list.json', json))
	.catch((error) => console.log(error));
