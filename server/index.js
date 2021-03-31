const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

cron.schedule('16 6 * * *', () => {
	console.log('cron fired at 6:16am')
})


cron.schedule('45 5 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node urcna-scrape.js')
	console.log('cron fired')
  });

cron.schedule('46 5 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node arp-scrape.js')
	console.log('cron fired')
  });

cron.schedule('47 5 * * *', () => {
	shell.exec('node opc-scrape.js')
	console.log('cron fired')
  });

  cron.schedule('48 5 * * *', () => {
	shell.exec('node pca-scrape.js')
	console.log('cron fired')
  });

  cron.schedule('49 5 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node prc-scrape.js')
	console.log('cron fired')
  });

  cron.schedule('50 5 * * *', () => {
	shell.exec('node hrc-scrape.js')
	console.log('cron fired')
  });

  cron.schedule('51 5 * * *', () => {
	shell.exec('node rpcna-scrape.js')
	console.log('cron fired')
  });

cron.schedule('55 5 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm build')
	console.log('cron fired')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
