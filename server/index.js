const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shell = require('shelljs');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


cron.schedule('5 2 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node urcna-scrape.js')
	console.log('cron fired at 2:05 am')
  });

cron.schedule('6 2 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node arp-scrape.js')
	console.log('cron fired at 2:06 am')
  });

// cron.schedule('7 2 * * *', () => {
// 	shell.cd(path.join(__dirname)).exec('node opc-scrape.js')
// 	console.log('cron fired at 2:07 am')
//   });

  cron.schedule('8 2 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node pca-scrape.js')
	console.log('cron fired at 2:08 am')
  });

  cron.schedule('9 2 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node prc-scrape.js')
	console.log('cron fired at 2:09 am')
  });

  cron.schedule('10 2 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node hrc-scrape.js')
	console.log('cron fired at 2:10 am')
  });

  cron.schedule('11 2 * * *', () => {
	shell.cd(path.join(__dirname)).exec('node rpcna-scrape.js')
	console.log('cron fired at 2:11 am')
  });

cron.schedule('40 2 * * *', () => {
	shell.cd(path.join(__dirname, '..')).exec('npm run build')
	console.log('cron fired at 2:40 am. task complete.')
  });

const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
