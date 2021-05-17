const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

function getUrlList(html) {
	const $ = cheerio.load(html);

	const urlArray = [];

	$('h3').each((i, el) => {
		const url = $(el).children().attr('href');
		urlArray.push(url);
	});

	return urlArray;
}

async function scrapeCong(html) {
	try {
		const $ = cheerio.load(html);
		const info = $('.itemExtraFields');
		const name = $('h2').text().trim();
		let pastor = '';
		let address = '';
		let phone = '';

		info.find('span').each((i, el) => {
			if ($(el).text().includes('Minister')) {
				pastor = $(el).next().text().trim();
			} else if ($(el).text().includes('Address')) {
				address = $(el)
					.next()
					.text()
					.replace(/\n/g, ' ')
					.replace(/Tel:(.*)/g, '')
					.replace(/Bulletin:(.*)/g, '')
					.replace(/\(\d\d\d\)(.*)/g, '')
					.trim();

				if (address.includes('Tel')) {
					phone = address.match(/Tel:(.*)/)[1].trim();
				}
			} else if ($(el).text().match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
                phone = $(el).text().match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)[0].trim()
            }
		});

        if(name === 'Fenwick'){
            address = '1075 Boyle Road, Fenwick, Ontario L0S 1C0'
        }

		const congregation = {
			id: uuidv4(),
			denom: 'FRCNA',
			name: name,
			pastor: pastor,
			address: address,
			phone: phone,
		};

        if (address.match(/\d{5}(?!.*\d{5})/g) !== null) {
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
    
            congregation.lat = lat;
            congregation.long = long;
        } else if (address.match(/[A-Z]\d[A-Z]/g) !== null) {
            const zip = address
                .match(/[A-Z]\d[A-Z](?!.*[A-Z]\d[A-Z])/g)
                .join()
                .replace(/.*,/g, '')
                .trim();
    
            const url = `http://api.zippopotam.us/CA/${zip}`;
    
            const res = await fetch(url);
            const json = await res.json();
    
            const lat = await json.places[0].latitude;
            const long = await json.places[0].longitude;
    
            congregation.lat = lat;
            congregation.long = long;
        }    

		return congregation;
        
	} catch {
		(error) => console.log(error);
	}
}

async function scrapeFrcna() {
	try {
		const response = await fetch(
			'https://frcna.org/component/k2/itemlist/category/5'
		);
		const html = await response.text();
		const urlList = await getUrlList(html);

		for await (url of urlList) {
			const response = await fetch(`https://www.frcna.org${url}`);
			const html = await response.text();
			const cong = await scrapeCong(html);
			console.log(cong);
		}
	} catch {
		(error) => console.log(error);
	}
}

scrapeFrcna();
