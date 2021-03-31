const cron = require('node-cron');

// cron.schedule('*/3 * * * *', () => {
// 	console.log('scrape cron running')
// 	fetchUrl.catch(error => console.log(error))
//   });

cron.schedule('* * * * *', () => {
	console.log('cron running')
  });