const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

async function fetchArpData() {
    const arpData = []

	const coordinates = [
		{ lat: 52.04382, long: -116.89581 },
		{ lat: 40.8364, long: -116.72003 },
		{ lat: 33.27284, long: -108.10675 },
		{ lat: 45.31444, long: -99.55389 },
		{ lat: 33.25814, long: -95.07147 },
		{ lat: 43.36607, long: -84.08514 },
		{ lat: 33.62485, long: -79.33905 },
		{ lat: 45.43175, long: -68.73449 },
        { lat: 52.29718, long: -83.58801},
        { lat: 55.70432, long: -100.72668},
        { lat: 57.352124, long: -119.535280}
	];

	for await (coordinate of coordinates) {
		const url = `http://arpchurch.org/wp-admin/admin-ajax.php?action=store_search&lat=${coordinate.lat}&lng=${coordinate.long}&max_results=100&search_radius=500`;

		const res = await fetch(url);
        const data = await res.json();
        arpData.push(data)
	}

    return arpData.flat()
}


async function createArpJson(){
    const data = await fetchArpData().catch(error => console.log(error))

    const arp = []
    data.forEach(obj => {

        const date = new Date();
		const update = `Updated on ${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}.`;

        const cong = {
            name: obj.store,
            pastor: obj.fax,
            address: `${obj.address}, ${obj.city}, ${obj.state} ${obj.zip}`,
            phone: obj.phone,
            website: obj.url,
            email: obj.email,
            denom: 'ARP',
            id: uuidv4(),
            long: obj.lng,
            lat: obj.lat,
            date: update,
        }

        arp.push(cong)
    })

    const arr = JSON.stringify(arp)
        fs.writeFileSync('../../frontend/src/api/arp.json', arr);
        console.log('Created json');
}

createArpJson().catch(error => console.log(error))
