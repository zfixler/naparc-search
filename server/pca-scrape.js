const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const pca = [];
let count = 0;
let completed = 0
const usa = [
	'AL',
	'AK',
	'AZ',
	'AR',
	'CA',
	'CO',
	'CT',
	'DE',
	'DC',
	'FL',
	'GA',
	'HI',
	'ID',
	'IL',
	'IN',
	'IA',
	'KS',
	'KY',
	'LA',
	'ME',
	'MD',
	'MA',
	'MI',
	'MN',
	'MS',
	'MO',
	'MT',
	'NE',
	'NV',
	'NH',
	'NJ',
	'NM',
	'NY',
	'NC',
	'ND',
	'OH',
	'OK',
	'OR',
	'PA',
	'RI',
	'SC',
	'SD',
	'TN',
	'TX',
	'UT',
	'VT',
	'VA',
	'WA',
	'WV',
	'WI',
	'WY',
];

async function getUsLongLat(city, state) {
	if(city === undefined || state === undefined){
		return [null, null]
	} else {

	let name = null;

	if(city.includes('.')){
		name = city.replace(/.*\.\s/g, '')
	} else {
		name = city.replace(/\s.*/g, '')
	}

	const res = await fetch(`http://api.zippopotam.us/us/${state}/${name}`);
	const json = await res.json();

	let lat = null;
	let long = null;

	if (json.places !== undefined) {
		const location = json.places.filter(ln => ln['place name'].toLowerCase() === city)

		if(location[0] === undefined){
			lat = json.places[0].latitude
			long = json.places[0].longitude
		} else {
			lat = location[0].latitude;
			long = location[0].longitude;
		}
	}

	return [lat, long];
	}
}

async function getCaLongLat(city, state) {
	let name = null;

	if(city.includes('.')){
		name = city.replace(/.*\.\s/g, '')
	} else {
		name = city.replace(/\s.*/g, '')
	}

	const res = await fetch(`http://api.zippopotam.us/ca/${state}/${name}`);
	const json = await res.json();

	let lat = null;
	let long = null;

	if (json.places !== undefined) {
		const location = json.places.filter(ln => ln['place name'].toLowerCase() === city)
		
		if(location[0] === undefined){
			lat = json.places[0].latitude;
			long = json.places[0].longitude;
		} else {
			lat = location[0].latitude;
			long = location[0].longitude;
		}
	}

	return [lat, long];
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

		const city = $(el).next().text();
		const state = $(el).next().next().text();

		const date = new Date();
		const update = `${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}`;

		const cong = {
			id: uuidv4(),
			name: name,
			phone: phone,
			pastor: pastor,
			email: email,
			website: website ? `http://${website}` : '',
			address: `${city}, ${state}`,
			city: city.toLowerCase(),
			state: state.toLowerCase(),
			date: update,
			denom: 'PCA',
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
	count = stateSelectorArray.length;
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
		if (state !== 'Select State' || '-') {
			const data = `State=${state}&orderby=1`;
			const url = 'https://stat.pcanet.org/ac/directory/directory.cfm';
			const html = await fetchPage(url, data).catch((error) => {
				if (error.code === 'ECONNRESET') {
					fetchPage(url, data).catch((error) => console.log(error));
				} else {
					console.log(error);
				}
			});

			if(typeof html === 'string'){
			const stateCongs = await scrapePage(html).catch((error) =>
				console.log(error)
			);

			if (usa.includes(state)) {
				for await (cong of stateCongs) {
					if (cong !== undefined) {
						const locArr = await getUsLongLat(cong.city, cong.state).catch(
							(error) => {
								if (error.code === 'ECONNRESET') {
									getUsLongLat(cong.city, cong.state).catch((error) =>
										console.log(error)
									);
								} else {
									console.log(error);
								}
							}
						);
						if(locArr !== undefined){
							cong.lat = locArr[0];
							cong.long = locArr[1];
						}
					}
				}
			} else {
				for await (cong of stateCongs) {
					const locArr = await getCaLongLat(cong.city, cong.state).catch(
						(error) => {
							if (error.code === 'ECONNRESET') {
								getCaLongLat(cong.city, cong.state).catch((error) =>
									console.log(error)
								);
							} else {
								console.log(error);
							}
						}
					);
					if(locArr !== undefined){
						cong.lat = locArr[0];
						cong.long = locArr[1];
					}
				}
			}
			pca.push(stateCongs);
			completed = Math.round((pca.length / (count - 1)) * 100)
			console.log(`${completed}% completed.`)
			}
		}
	}
	if (completed >= 100) {
		const finArr = pca.flat();
		console.log(finArr.length);
		const data = JSON.stringify(finArr);
		fs.writeFileSync('../src/api/pca.json', data);
		console.log('Created json');
	}
}

exports.getPages = getPages
