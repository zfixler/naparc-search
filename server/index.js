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


cron.schedule('25 6 * * *', () => {
	shell.exec('node urcna-scrape.js')
	console.log('cron fired at 6:25 am')
  });

cron.schedule('26 6 * * *', () => {
	shell.exec('node arp-scrape.js')
	console.log('cron fired at 6:26 am')
  });

cron.schedule('27 6 * * *', () => {
	shell.exec('node opc-scrape.js')
	console.log('cron fired at 6:27 am')
  });

  cron.schedule('28 6 * * *', () => {
	shell.exec('node pca-scrape.js')
	console.log('cron fired at 6:28 am')
  });

  cron.schedule('30 6 * * *', () => {
	shell.exec('node prc-scrape.js')
	console.log('cron fired at 6:30 am')
  });

  cron.schedule('31 6 * * *', () => {
	shell.exec('node hrc-scrape.js')
	console.log('cron fired at 6:31 am')
  });

  cron.schedule('32 6 * * *', () => {
	shell.exec('node rpcna-scrape.js')
	console.log('cron fired at 6:32 am')
  });

cron.schedule('40 6 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm build')
	console.log('cron fired at 6:40 am. task complete.')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
