const fetch = require('node-fetch')

async function test(){
    const address = '5132 Crimson King Way Beamsville, Ontario L0R 1B8'

    try {
        if(address.match(/[A-Z]\d[A-Z]/g)) {
			const zip = address
				.match(/[A-Z]\d[A-Z]/g)
				.join()
				.trim();

            console.log(zip)

			const url = `http://api.zippopotam.us/CA/${zip}`;

			const res = await fetch(url);
			const json = await res.json();

			const lat = await json.places[0].latitude;
			const long = await json.places[0].longitude;

			console.log(lat, long)
		}
    } catch { error => console.log(error)}
}

test()