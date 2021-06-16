# NAPARC Search

This project includes Express, React, and a web scraper built with Cheerio.js. Each denomination website is individually scraped, and the results are stored directly in the React application. This method provides for very fast search times. After all the scrapers are run periodly (via node-chron), the application is rebuilt with the updated JSON files included.