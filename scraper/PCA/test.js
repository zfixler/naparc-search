const fetch = require('node-fetch');

// const cheerio = require('cheerio');
// const fetch = require('node-fetch');

// let href = 'churchinfo.cfm?OrgID=1152'

// async function getAddress(href) {
// 	const page = 
//         await fetch(`https://stat.pcanet.org/ac/directory/${href}`);

// 	const html = await page.text();
// 	const $ = cheerio.load(html);

// 	return $('textarea').attr('value')
// }

// getAddress(href)
//     .then(res => console.log(res))
//     .catch(error => console.log(error))

// async function getUsLongLat(city, state) {
// 	const first = city.replace(/\s.*/g, '')

// 	const res = await fetch(`http://api.zippopotam.us/us/${state}/${first}`);
// 	const json = await res.json();

// 	const location = await json.places.filter(ln => ln['place name'].toLowerCase() === city)

// 	if(location[0] === undefined){
// 		return json.places[0].longitude
// 	} else {
// 		return location[0].longitude
// 	}

// }

// getUsLongLat('grove city', 'pa')
// 	.then(res => console.log(res))
// 	.catch(error => console.log(error))

const city = 'Fr. Street'	

let first = null;

if(city.includes('.')){
	first = city.replace(/.*\.\s/g, '')
} else {
	first = city.replace(/\s.*/g, '')
}

// const first = city.replace(/\s.*/g, '')
	
// first.includes('.') && first.replace(/.*\.\s/g, '')

console.log(first)