/**
 * 测试法规检索
 */
const C = require('../common/constant');
jest.setTimeout(C.JEST_SET_TIMEOUT);

const util = require('../common/util');
const puppeteer = require('puppeteer');
const alphaConfig = require('../common/envConfig');

const bigDataInputSelector = '#bg-data-search-input';
const alphaSearchSelector = '#alphaSearch';
const searchBtnSelector= '#adv-search-btn';
const totalSelector = '#totalCount';
const searchInResultBtnSelector = '#search-in-result';
const advSearchInputSelector = '#adv-search-input';
const advQueryArray=['物权','诉讼','法 关于','-物权','法 -物权'];

const requestStringArray = [] //后台请求的参数，写一个数组，判断期望和实际发出的是不是一个，不是的话存一个错误信息到mongo
function logRequest(interceptedRequest) {
    interceptedRequest.continue();
    const url = interceptedRequest.url()
    const params = util.getQueryString('query', url)
    if (url.indexOf('ilawregu-search/api/v1/lawregu/list') > -1) {
        requestStringArray.push(params);
    }
}

let browser, page;
beforeAll(async () => {
    //获取全局会用到的变量
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    page.removeListener('request', logRequest);
    await page.setRequestInterception(true);
    page.on('request', logRequest);
    await page.setViewport({width: 1400, height: 800});

    //登录
    await page.tracing.start({path: 'trace.json'})
    await page.goto(`${alphaConfig.env}#/login/password`);
    await page.waitForSelector('form[name="loginForm"]');
    await page.type('input[name="username"]', alphaConfig.userName);
    await page.type('input[name="account_password"]', alphaConfig.password);

    const navigationPromise = page.waitForNavigation();
    await page.click('.login-button');
    await navigationPromise;
});

afterAll(async () => {
    await page.tracing.stop()
    await browser.close();
});

test('键入“物权”', async () => {
    await  page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitFor(1000);
    await page.waitForSelector(bigDataInputSelector);
    let bigDataInput = await page.$(bigDataInputSelector)
    await bigDataInput.focus()
    await page.type(bigDataInputSelector, advQueryArray[0], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let alphaSearchBtn = await page.$(alphaSearchSelector);
    alphaSearchBtn.click();
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText)
    let keywordText1 = await page.$eval('#mainbody > section > div.alphav2-wrap.ng-scope.ng-fadeInUp > div > div.right-container.left > div.condition-container > p > span', el => el.innerText);
    expect(totalCount).toBeTruthy();
    expect(keywordText1).toBe('全文:物权');
    if(requestStringArray[0] !== '全文:物权') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[0]).toBe('全文:物权');
});

test('在结果中检索', async () => {
    await page.waitForSelector(advSearchInputSelector);
    let bigDataInput = await page.$(advSearchInputSelector)
    await bigDataInput.focus()
    await page.type(advSearchInputSelector, advQueryArray[1], {delay: 500}); // Types instantly
    let searchInResultBtn = await page.$(searchInResultBtnSelector)
    searchInResultBtn.click()
    await page.waitFor(2000);
    let searchBtn = await page.$(searchBtnSelector)
    searchBtn.click()
    await page.waitFor(2000);
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText)
    expect(totalCount).toBeTruthy();
    if(requestStringArray[1] !== '全文:物权,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[1]).toBe('全文:物权,全文:诉讼');
});

test('筛选框嵌入 \'法 关于\'', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitForSelector(bigDataInputSelector);
    let bigDataInput = await page.$(bigDataInputSelector)
    await bigDataInput.focus()
    await page.type(bigDataInputSelector, advQueryArray[2], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let alphaSearchBtn = await page.$(alphaSearchSelector)
    alphaSearchBtn.click()
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText)
    let keywordText1 = await page.$eval('#mainbody > section > div.alphav2-wrap.ng-scope.ng-fadeInUp > div > div.right-container.left > div.condition-container > p > span', el => el.innerText)
    expect(totalCount).toBeTruthy();
    expect(keywordText1).toBe('全文:法');
    if(requestStringArray[2] !== '全文:法,全文:关于') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[2]).toBe('全文:法,全文:关于');
});

test('筛选框嵌入在结果中搜索并输入 \'诉讼\'', async () => {
    let bigDataInput = await page.$(advSearchInputSelector)
    await bigDataInput.focus()
    await page.type(advSearchInputSelector, advQueryArray[1], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let searchBtn = await page.$(searchBtnSelector)
    searchBtn.click()
    await page.waitFor(2000);
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText)
    let keywordText1 = await page.$eval('#mainbody > section > div.alphav2-wrap.ng-scope.ng-fadeInUp > div > div.right-container.left > div.condition-container > p > span', el => el.innerText)
    expect(totalCount).toBeTruthy();
    expect(keywordText1).toBe('全文:法');
    if(requestStringArray[3] !== '全文:法,全文:关于,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[3]).toBe('全文:法,全文:关于,全文:诉讼');
});

test('筛选框嵌入在结果中搜索并输入 \'-物权\'', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitForSelector(bigDataInputSelector);
    let bigDataInput = await page.$(bigDataInputSelector)
    await bigDataInput.focus()
    await page.type(bigDataInputSelector, advQueryArray[3], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let alphaSearchBtn = await page.$(alphaSearchSelector)
    alphaSearchBtn.click()
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText)
    let keywordText1 = await page.$eval('#mainbody > section > div.alphav2-wrap.ng-scope.ng-fadeInUp > div > div.right-container.left > div.condition-container > p > span', el => el.innerText);
    expect(totalCount).toBeTruthy();
    expect(keywordText1).toBe('全文不包含:物权');
    if(requestStringArray[4] !== '全文:-物权') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[4]).toBe('全文:-物权');
});

test('筛选框嵌入在结果中搜索并输入 \'诉讼\'', async () => {
    let bigDataInput = await page.$(advSearchInputSelector)
    await bigDataInput.focus()
    await page.type(advSearchInputSelector, advQueryArray[1], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let searchBtn = await page.$(searchBtnSelector)
    searchBtn.click()
    await page.waitFor(2000);
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText)
    let keywordText1 = await page.$eval('#mainbody > section > div.alphav2-wrap.ng-scope.ng-fadeInUp > div > div.right-container.left > div.condition-container > p > span', el => el.innerText);
    expect(totalCount).toBeTruthy();
    expect(keywordText1).toBe('全文不包含:物权');
    if(requestStringArray[5] !== '全文:-物权,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[5]).toBe('全文:-物权,全文:诉讼');
});

test('筛选框嵌入在结果中搜索并输入 \'法 -物权\'', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitForSelector(bigDataInputSelector);
    let bigDataInput = await page.$(bigDataInputSelector)
    await bigDataInput.focus()
    await page.type(bigDataInputSelector, advQueryArray[4], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let alphaSearchBtn = await page.$(alphaSearchSelector)
    alphaSearchBtn.click()
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText);
    expect(totalCount).toBeTruthy();
    if(requestStringArray[6] !== '全文:法,全文:-物权') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[6]).toBe('全文:法,全文:-物权');
});

test('筛选框嵌入在结果中搜索并输入 \'诉讼\'', async () => {
    let bigDataInput = await page.$(advSearchInputSelector)
    await bigDataInput.focus()
    await page.type(advSearchInputSelector, advQueryArray[1], {delay: 500}); // Types instantly
    await page.waitFor(2000);
    let searchBtn = await page.$(searchBtnSelector)
    searchBtn.click()
    await page.waitFor(2000);
    await page.waitForSelector(totalSelector);
    let totalCount = await page.$eval(totalSelector, el => el.innerText);
    expect(totalCount).toBeTruthy();
    if(requestStringArray[7] !== '全文:法,全文:-物权,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[7]).toBe('全文:法,全文:-物权,全文:诉讼');
});
