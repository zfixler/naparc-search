const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('20 21 * * *', () => {
	shell.exec('node urcna-scrape.js')
  });

cron.schedule('21 21 * * *', () => {
	shell.exec('node arp-scrape.js')
  });

cron.schedule('22 21 * * *', () => {
	shell.exec('node opc-scrape.js')
  });

  cron.schedule('25 21 * * *', () => {
	shell.exec('node pca-scrape.js')
  });

  cron.schedule('28 21 * * *', () => {
	shell.exec('node prc-scrape.js')
  });

  cron.schedule('29 21 * * *', () => {
	shell.exec('node hrc-scrape.js')
  });

  cron.schedule('30 21 * * *', () => {
	shell.exec('node rpcna-scrape.js')
  });

cron.schedule('35 21 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm build')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
