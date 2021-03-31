const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');
// const { createArpJson } = require(path.join(__dirname, 'arp-scrape.js'));
// const { getURL } = require(path.join(__dirname, 'rpcna-scrape.js'));
// const { scrapeData } = require(path.join(__dirname, 'opc-scrape.js'));
// const { getPages } = require(path.join(__dirname, 'pca-scrape.js'));
const { fetchUrl } = require(path.join(__dirname, 'urcna-scrape.js'));
// const { getUrls }= require(path.join(__dirname, 'prc-scrape.js'));
// const { getLongLat } = require(path.join(__dirname, 'hrc-scrape.js'));

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// cron.schedule('*/3 * * * *', () => {
// 	console.log('scrape cron running')
// 	fetchUrl.catch(error => console.log(error))
//   });

cron.schedule('* * * * *', () => {
	shell.exec('node test.js')
	console.log('cron ran')
  });


const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
