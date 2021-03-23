const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const { createArpJson } = require(path.join(__dirname, 'arp-scrape.js'));
const { getURL } = require(path.join(__dirname, 'rpcna-scrape.js'));
const { scrapeOpc } = require(path.join(__dirname, 'opc-scrape.js'));
const { getPages } = require(path.join(__dirname, 'pca-scrape.js'));
const { fetchUrl } = require(path.join(__dirname, 'urcna-scrape.js'));
const { getUrls } = require(path.join(__dirname, 'prc-scrape.js'));
const { getLongLat } = require(path.join(__dirname, 'hrc-scrape.js'));

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, '..', 'public')));

const urcna = require(path.join(
	__dirname,
	'..',
	'public',
	'api',
	'urcna.json'
));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

async function runScripts() {
	const arp = await createArpJson().catch((error) => console.log(error));
	const hrc = await getLongLat().catch((error) => console.log(error));
	const opc = scrapeOpc();
	const pca = await getPages().catch((error) => console.log(error));
	const rpcna = await getURL().catch((error) => console.log(error));
	const urcna = await fetchUrl().catch((error) => console.log(error));
	const prc = await getUrls().catch((error) => console.log(error));

	const denoms = [
		{ json: arp, name: 'arp' },
		{ json: hrc, name: 'hrc' },
		{ json: opc, name: 'opc' },
		{ json: pca, name: 'pca' },
		{ json: rpcna, name: 'rpcna' },
		{ json: urcna, name: 'urcna' },
		{ json: prc, name: 'prc' },
	];

	denoms.forEach(denom => {
		fs.writeFile(path.join(__dirname, '..', 'public', 'api', `${denom.name}.json`), denom.json)
		console.log(`JSON created for ${denom.name}`)
	});
}

const current = new Date();
const currentDate = `${
	current.getMonth() + 1
}/${current.getDate()}/${current.getFullYear()}`;

if (urcna[0].date !== currentDate) {
	runScripts().catch(error => console.log(error))
}

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
	console.log('server started on port 5000');
});
