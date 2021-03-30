const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const fetchUrl = require('./urcna-scrape.js')

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

cron.schedule('*/2 * * * *', () => {
	console.log('scrape cron running')
	fetchUrl.catch(error => console.log(error))
  });

cron.schedule('* * * * *', () => {
	console.log('cron running')
  });


const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
