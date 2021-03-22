const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const fetch = require('node-fetch');

const { createArpJson } = require(path.join(__dirname, 'arp-scrape.js'));
const { getURL } = require(path.join(__dirname, 'rpcna-scrape.js'));
const { scrapeData } = require(path.join(__dirname, 'opc-scrape.js'));
const { getPages } = require(path.join(__dirname, 'pca-scrape.js'));
const { fetchUrl } = require(path.join(__dirname, 'urcna-scrape.js'));
const { getUrls }= require(path.join(__dirname, 'prc-scrape.js'));
const { getLongLat } = require(path.join(__dirname, 'hrc-scrape.js'));

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('20 7 * * 1,4', () => {
	createArpJson().catch(error => console.log(error))
	getLongLat().catch(error => console.log(error))
	scrapeData().catch(error => console.log(error))
	getPages().catch(error => console.log(error))
	getURL().catch(error => console.log(error))
	fetchUrl().catch(error => console.log(error))
	getUrls().catch(error => console.log(error))

	console.log('cron fired')
});

const PORT = process.env.PORT || 5000
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
	console.log('server started on port 5000');
});
