/**
 * 测试法规高级检索
 */
const C = require('../common/constant');
jest.setTimeout(C.JEST_SET_TIMEOUT);

const util = require('../common/util');
const puppeteer = require('puppeteer');
const alphaConfig = require('../common/envConfig');

const advSearchInputSelector='#adv-search-input'
const normalSearchSureBtnSelector='#adv-search-btn'
// 高级检索的打开按钮
const advSearchBtnSelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.search-border > div.right.init-ad-search.cursor'
// 高级检索的全文input
const advAllTextInputSelector = '.advanced-search-container .dimension-container:nth-child(2) .dimension.judge > input';
// 高级检索的确定搜索按钮
const advSearchSureBtnSelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.show-advanced-search-border > i-advanced-search > div > section > div.left-box.left > footer > div'

// 发文机关高级筛选的选择
const dispatchAuthorityInputSelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.show-advanced-search-border > i-advanced-search > div > section > div.left-box.left > section > div:nth-child(5) > div.dimension > input'

//效力级别 中法律的selector
const lawSelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.show-advanced-search-border > i-advanced-search > div > section > div.left-box.left > section > div.dimension.eff-level > div > div:nth-child(1)'
//效力级别 中行政法规的selector
const administrativeSelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.show-advanced-search-border > i-advanced-search > div > section > div.left-box.left > section > div.dimension.eff-level > div > div:nth-child(2)'
//军事法规
const militarySelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.show-advanced-search-border > i-advanced-search > div > section > div.left-box.left > section > div.dimension.eff-level > div > div:nth-child(9)'
//suggest的第一项
const suggestFirst = '.is-advanced-search-suggest .ns-popover-items p:nth-child(2)'
// 发文时间添加按钮
const postingDateAddSelector = '#mainbody > section > div.alphav2-wrap > div > div > div > div.search.show-advanced-search-border > i-advanced-search > div > section > div.right-box.right > section > div:nth-child(5)'
const postingDateSelectSelector = '.advanced-search-container .dimension-container:nth-child(6) > div.dimension.judge-time > input.dimension-input.start-date'
const postingDateSelectTodaySelector = '.day.today.active'
const advQueryArray = ['法 关于','诉讼','-物权','法 -物权','河北省'] //筛选的词，写一个数组不每次都输入

const requestStringArray = [] //后台请求的参数，写一个数组，判断期望和实际发出的是不是一个，不是的话存一个错误信息到mongo
function logRequest(interceptedRequest) {
    interceptedRequest.continue();
    const url = interceptedRequest.url()
    const params = util.getQueryString('query', url)
    if (url.indexOf('ilawregu-search/api/v1/lawregu/list') > -1) {
        requestStringArray.push(params)
    }
}

let browser, page;
beforeAll(async () => {
    //获取全局会用到的变量
    browser = await puppeteer.launch({headless:false});
    page = await browser.newPage();
    page.removeListener('request', logRequest);
    await page.setRequestInterception(true);
    page.on('request', logRequest);
    await page.setViewport({width: 1400, height: 800});

    //登录
    await page.goto(`${alphaConfig.env}#/login/password`);
    await page.waitForSelector('form[name="loginForm"]');
    await page.type('input[name="username"]', alphaConfig.userName);
    await page.type('input[name="account_password"]', alphaConfig.password);

    const navigationPromise = page.waitForNavigation();
    await page.click('.login-button');
    await navigationPromise;
});

afterAll(async () => {
    await browser.close();
});

test('法规打开高级检索，全文嵌入\'法 关于\'', async () => {
    await  page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(advSearchBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(1000);
    await page.type(advAllTextInputSelector, advQueryArray[0]);
    await page.waitFor(1000);
    let advSearchBtnSure = await page.$(advSearchSureBtnSelector)
    await advSearchBtnSure.click()
    await page.waitFor(1000);
    await page.waitForSelector('#totalCount');
    let totalCount = await page.$eval('#totalCount', el => el.innerText)
    expect(totalCount).toBeTruthy();
    if(requestStringArray[0] !== '全文:法,全文:关于') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[0]).toBe('全文:法,全文:关于');
});

test('在结果中搜索\'诉讼\'', async () => {
    await page.waitFor(1000);
    await page.type(advSearchInputSelector, advQueryArray[1]);
    await page.waitFor(1000);
    let searchInResult = await page.$('#search-in-result')
    await searchInResult.click()
    await page.waitFor(1000);
    let advSearchBtn = await page.$(normalSearchSureBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(1000);
    await page.waitForSelector('#totalCount');
    let totalCount = await page.$eval('#totalCount', el => el.innerText)
    expect(totalCount).toBeTruthy();
    if(requestStringArray[1] !== '全文:法,全文:关于,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[1]).toBe('全文:法,全文:关于,全文:诉讼');
});

test('法规打开高级检索，全文嵌入\'-物权\'', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(advSearchBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(2000);
    await page.type(advAllTextInputSelector, advQueryArray[2]);
    await page.waitFor(1000);
    let advSearchBtnSure = await page.$(advSearchSureBtnSelector)
    await advSearchBtnSure.click()
    await page.waitForSelector('#totalCount');
    let totalCount = await page.$eval('#totalCount', el => el.innerText)
    let keywordText1 = await page.$eval('#mainbody > section > div.alphav2-wrap > div > div.right-container.left > div.condition-container > p > span', el => el.innerText)
    expect(totalCount).toBeTruthy();
    expect(keywordText1).toBe('全文不包含:物权');
    if(requestStringArray[2] !== '全文:-物权') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[2]).toBe('全文:-物权');
});

test('在结果中搜索 \'诉讼\'', async () => {
    await page.waitFor(1000);
    await page.type(advSearchInputSelector, advQueryArray[1]);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(normalSearchSureBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(1000);
    await page.waitForSelector('#totalCount');
    let totalCount = await page.$eval('#totalCount', el => el.innerText)
    expect(totalCount).toBeTruthy();
    if(requestStringArray[3] !== '全文:-物权,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[3]).toBe('全文:-物权,全文:诉讼');
});

test('法规打开高级检索，全文嵌入\'法 -物权\'', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(advSearchBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(2000);
    await page.type(advAllTextInputSelector, advQueryArray[3]);
    await page.waitFor(1000);
    let advSearchBtnSure = await page.$(advSearchSureBtnSelector)
    await advSearchBtnSure.click()
    await page.waitForSelector('#totalCount');
    let totalCount = await page.$eval('#totalCount', el => el.innerText)
    expect(totalCount).toBeTruthy();
    if(requestStringArray[4] !== '全文:法,全文:-物权') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[4]).toBe('全文:法,全文:-物权');
});

test('键入“诉讼”+点击“检索Alpha法规库”', async () => {
    await page.waitFor(1000);
    await page.type(advSearchInputSelector, advQueryArray[1]);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(normalSearchSureBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(1000);
    await page.waitForSelector('#totalCount');
    let totalCount = await page.$eval('#totalCount', el => el.innerText);
    expect(totalCount).toBeTruthy();
    if(requestStringArray[5] !== '全文:法,全文:-物权,全文:诉讼') {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(requestStringArray[5]).toBe('全文:法,全文:-物权,全文:诉讼');
});

test('打开高级检索，在发文机关input输入\'河北省\' ，效力级别选择\'法律，行政法规，军事法规。数据应该为0\'', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(advSearchBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(1000);
    await page.type(dispatchAuthorityInputSelector, advQueryArray[4], {delay: 500});
    await page.keyboard.press('KeyA');
    await page.waitFor(1000);
    await page.keyboard.press('Backspace');
    // 发文机关的输入框
    let dispatchAuthorityInput = await page.$(dispatchAuthorityInputSelector)
    await dispatchAuthorityInput.click()
    await page.waitFor(1000);
    // 发文机关的suggest第一项
    await page.waitForSelector(suggestFirst);
    let advLitigantInputSuggest = await page.$(suggestFirst)
    await advLitigantInputSuggest.click()
    await page.waitFor(1000);
    // 效力级别 法律
    let lawSelectorBtn = await page.$(lawSelector)
    await lawSelectorBtn.click()
    // 效力级别 行政法规
    let administrativeBtn = await page.$(administrativeSelector)
    await administrativeBtn.click()
    // 效力级别 军事法规
    let militaryBtn = await page.$(militarySelector)
    await militaryBtn.click()
    let advSearchBtnSure = await page.$(advSearchSureBtnSelector)
    await advSearchBtnSure.click()
    await page.waitFor(2000);
    let totalCount = 0;
    try {
        totalCount = await page.$eval('#totalCount', el => el.innerText);
    } catch (error) {
    }
    if(totalCount) {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(totalCount).toBe(0);
});

test('打开高级检索，发文日期选择今天，筛选结果列表数量不为0', async () => {
    await page.goto(`${alphaConfig.env}#/app/tool/search/case?searchType=law`);
    await page.waitFor(1000);
    let advSearchBtn = await page.$(advSearchBtnSelector)
    await advSearchBtn.click()
    await page.waitFor(1000);
    let postingDateAddBtn = await page.$(postingDateAddSelector)
    await postingDateAddBtn.click()
    let postingDateSelectInput = await page.$(postingDateSelectSelector)
    await postingDateSelectInput.click()
    await page.waitFor(2000);
    let postingDateSelectToday = await page.$(postingDateSelectTodaySelector)
    await postingDateSelectToday.click()
    let advSearchSureBtn = await page.$(advSearchSureBtnSelector)
    await advSearchSureBtn.click()
    await page.waitFor(2000);
    let totalCount = 0;
    try {
        totalCount = await page.$eval('#totalCount', el => el.innerText);
    } catch (error) {
    }
    if(!totalCount) {
        await page.screenshot({path: `./docs/${new Date().getTime()}.png`});
    }
    await expect(totalCount).toBeTruthy();
});

