const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cron = require('node-cron')

const { createArpJson } = require(path.join(__dirname, 'arp-scrape.js'));
const { getURL } = require(path.join(__dirname, 'rpcna-scrape.js'));
const { scrapeOpc } = require(path.join(__dirname, 'opc-scrape.js'));
const { getPages } = require(path.join(__dirname, 'pca-scrape.js'));
const { fetchUrl } = require(path.join(__dirname, 'urcna-scrape.js'));
const { getUrls } = require(path.join(__dirname, 'prc-scrape.js'));
const { getLongLat } = require(path.join(__dirname, 'hrc-scrape.js'));

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, '..', 'public')));


app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

function runScripts() {
	createArpJson()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `arp.json`), json))
		.then(console.log('ARP json created'))
		.catch((error) => console.log(error));
		
	getLongLat()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `hrc.json`), json))
		.then(console.log('HRC json created'))
		.catch((error) => console.log(error));

	scrapeOpc()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `opc.json`), json))
		.then(console.log('OPC json created'))
		.catch(error => console.log(error))
	
	getPages()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `pca.json`), json))
		.then(console.log('PCA json created'))
		.catch(error => console.log(error))

	getURL()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `rpcna.json`), json))
		.then(console.log('RPCNA json created'))
		.catch(error => console.log(error))

	fetchUrl()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `urcna.json`), json))
		.then(console.log('URCNA json created'))
		.catch(error => console.log(error))

	getUrls()
		.then(res => JSON.stringify(res))
		.then(json => fs.writeFileSync(path.join(__dirname, '..', 'public', 'api', `prc.json`), json))
		.then(console.log('PRC json created'))
		.catch(error => console.log(error))
}

cron.schedule('30 7 * * 3,6', () => {
	runScripts();
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
