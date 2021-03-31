const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('5 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node urcna-scrape.js')
	console.log('cron fired at 7:05 am')
  });

cron.schedule('6 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node arp-scrape.js')
	console.log('cron fired at 7:06 am')
  });

cron.schedule('7 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node opc-scrape.js')
	console.log('cron fired at 7:07 am')
  });

  cron.schedule('8 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node pca-scrape.js')
	console.log('cron fired at 7:08 am')
  });

  cron.schedule('9 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node prc-scrape.js')
	console.log('cron fired at 7:09 am')
  });

  cron.schedule('10 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node hrc-scrape.js')
	console.log('cron fired at 7:10 am')
  });

  cron.schedule('11 7 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node rpcna-scrape.js')
	console.log('cron fired at 7:11 am')
  });

cron.schedule('15 7 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm run build')
	console.log('cron fired at 7:15 am. task complete.')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
