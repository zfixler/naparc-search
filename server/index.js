const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('45 21 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node urcna-scrape.js')
  });

cron.schedule('46 21 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node arp-scrape.js')
  });

cron.schedule('47 21 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node opc-scrape.js')
  });

  cron.schedule('48 21 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node pca-scrape.js')
  });

  cron.schedule('49 21 * * *', () => {
	shell.cd(path.join(__dirname)).cd(path.join(__dirname)).exec('node prc-scrape.js')
  });

  cron.schedule('50 21 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node hrc-scrape.js')
  });

  cron.schedule('51 21 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node rpcna-scrape.js')
  });

cron.schedule('55 21 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm build')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
