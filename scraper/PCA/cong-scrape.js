const puppeteer = require('puppeteer');

async function load(){
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(30000); 

    await page.goto('https://stat.pcanet.org/ac/directory/directory.cfm')
    

    // const data = await page.evaluate(() => {
    //     document.querySelector('body').textContent
    // })

    console.log(await page.content())

    await browser.close()
}

load().catch(error => console.log(error))