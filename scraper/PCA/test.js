const cheerio = require('cheerio');
const fetch = require('node-fetch');

let href = 'churchinfo.cfm?OrgID=1152'

async function getAddress(href) {
	const page = 
        await fetch(`https://stat.pcanet.org/ac/directory/${href}`);

	const html = await page.text();
	const $ = cheerio.load(html);

	return $('textarea').attr('value')
}

getAddress(href)
    .then(res => console.log(res))
    .catch(error => console.log(error))

	