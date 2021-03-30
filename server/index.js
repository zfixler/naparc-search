const express = require('express');
const app = express();
const path = require('path');
const cron = require('node-cron');
const URCNA = require('./urcna-scrape.js').fetchUrl

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

cron.schedule('*/3 * * * *', () => {
	URCNA.catch(error => console.log(error))
  });


const PORT = 13373;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
