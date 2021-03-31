const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');
const { dir } = require('node:console');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('41 6 * * *', () => {
	shell.cd(dir).exec('node urcna-scrape.js')
	console.log('cron fired at 6:41 am')
  });

cron.schedule('42 6 * * *', () => {
	shell.cd(dir).exec('node arp-scrape.js')
	console.log('cron fired at 6:42 am')
  });

cron.schedule('43 6 * * *', () => {
	shell.cd(dir).exec('node opc-scrape.js')
	console.log('cron fired at 6:43 am')
  });

  cron.schedule('44 6 * * *', () => {
	shell.cd(dir).exec('node pca-scrape.js')
	console.log('cron fired at 6:44 am')
  });

  cron.schedule('45 6 * * *', () => {
	shell.cd(dir).exec('node prc-scrape.js')
	console.log('cron fired at 6:45 am')
  });

  cron.schedule('46 6 * * *', () => {
	shell.cd(dir).exec('node hrc-scrape.js')
	console.log('cron fired at 6:46 am')
  });

  cron.schedule('47 6 * * *', () => {
	shell.cd(dir).exec('node rpcna-scrape.js')
	console.log('cron fired at 6:47 am')
  });

cron.schedule('53 6 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm build')
	console.log('cron fired at 6:53 am. task complete.')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
