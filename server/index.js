const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('48 6 * * *', () => {
	shell.cd('server').exec('node urcna-scrape.js')
	console.log('cron fired at 6:48 am')
  });

cron.schedule('49 6 * * *', () => {
	shell.cd('server').exec('node arp-scrape.js')
	console.log('cron fired at 6:49 am')
  });

cron.schedule('50 6 * * *', () => {
	shell.cd('server').exec('node opc-scrape.js')
	console.log('cron fired at 6:50 am')
  });

  cron.schedule('51 6 * * *', () => {
	shell.cd('server').exec('node pca-scrape.js')
	console.log('cron fired at 6:51 am')
  });

  cron.schedule('52 6 * * *', () => {
	shell.cd('server').exec('node prc-scrape.js')
	console.log('cron fired at 6:52 am')
  });

  cron.schedule('53 6 * * *', () => {
	shell.cd('server').exec('node hrc-scrape.js')
	console.log('cron fired at 6:53 am')
  });

  cron.schedule('54 6 * * *', () => {
	shell.cd('server').exec('node rpcna-scrape.js')
	console.log('cron fired at 6:54 am')
  });

cron.schedule('59 6 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm build')
	console.log('cron fired at 6:59 am. task complete.')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
