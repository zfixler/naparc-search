const express = require('express');
const app = express();
const path = require('path');
const { createArpJson } = require(path.join(__dirname, 'arp-scrape.js'));
const { getURL } = require(path.join(__dirname, 'rpcna-scrape.js'));
const { scrapeOpc } = require(path.join(__dirname, 'opc-scrape.js'));
const { getPages } = require(path.join(__dirname, 'pca-scrape.js'));
const { fetchUrl } = require(path.join(__dirname, 'urcna-scrape.js'));
const { getUrls } = require(path.join(__dirname, 'prc-scrape.js'));
const { getLongLat } = require(path.join(__dirname, 'hrc-scrape.js'));


app.use(express.static(path.join(__dirname, '..', 'build')));


const urcna = require(path.join(__dirname, 'api', 'urcna.json'));


app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const current = new Date();
const currentDate = `${
	current.getMonth() + 1
}/${current.getDate()}/${current.getFullYear()}`;

if (urcna[0].date !== currentDate) {
	createArpJson().catch((error) => console.log(error));
	getLongLat().catch((error) => console.log(error));
	scrapeOpc();
	getPages().catch((error) => console.log(error));
	getURL().catch((error) => console.log(error));
	fetchUrl().catch((error) => console.log(error));
	getUrls().catch((error) => console.log(error));
}

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
	console.log('server started on port 5000');
});
