/**
 * Created by Jerry on 2018/8/2.
 */

    /**
     * 测试法规检索
     */
const C = require('../common/constant');
jest.setTimeout(C.JEST_SET_TIMEOUT);
var fs = require('fs');
const puppeteer = require('puppeteer');

let browser, page;
beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.setViewport({width: 1400, height: 800});
    page.setDefaultNavigationTimeout(600000000)
    await page.goto('http://www.dytt8.net/');

});

afterAll(async () => {
     await browser.close();
});
var allDownloadUrs=[]
async function goDetail(tag) {
    await page.goto(tag.href);
    await page.waitFor(2000);
    await page.waitForSelector('#Zoom > span > table > tbody > tr > td > a');
    let name = await page.$eval('#header > div > div.bd2 > div.bd3 > div.bd3r > div.co_area2 > div.title_all > h1 > font', el => el.innerText)
    let url = await page.$eval('#Zoom > span > table > tbody > tr > td > a', el => el.innerText)
    allDownloadUrs.push({name:name,url:url})
    fs.writeFile('videoUrl.json', JSON.stringify(allDownloadUrs), 'utf8', function () {
        console.log("保存完成");
    });
}


test('获取电影的页面id', async () => {
    // let advSearchBtnSure = await page.$(listAHref)
    await page.waitFor(2000);
    let aTags = await page.evaluate(() => {
        let as =  Array.from(document.querySelectorAll('.co_content8 table tbody > tr > td:nth-child(1) > a:nth-child(2)'));
        const items = [];
        for (let element of as) {
            items.push({href:element.href,text:element.innerText});
        }
        return items;
    });
    for(let i=0;i<aTags.length;i++){
        await goDetail(aTags[i])
    }
    // let advSearchBtnSure = await page.$(advSearchSureBtnSelector)
});
