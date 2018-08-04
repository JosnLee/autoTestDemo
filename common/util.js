var results = require("../model/Results");
var bigDataTestCaseMap = require("./bigDataTestCaseMap");
function getEnv(page) {
    if (page.alphaEnv.startsWith('https://alpha')) {
        return 'prod'
    }
    if (page.alphaEnv.startsWith('https://dev')) {
        return 'dev'
    }
    if (page.alphaEnv.startsWith('https://dev')) {
        return 'test'
    }
    if (page.alphaEnv.startsWith('https://pre')) {
        return 'pre'
    }
}
function saveCaseResultToDataBase(finalRes, page) {
    var caseInfo = bigDataTestCaseMap(finalRes.id)
    var entity = {
        runSign: page.runSign,
        caseId: finalRes.id,
        caseResult: finalRes.result,
        memo: caseInfo.option,
        errorMsg: finalRes.error,
        env: getEnv(page)
    }
    var resultToSave = new results(entity)
    resultToSave.save(function (err, res) {
        console.log(err)
    })
}
function getQueryString(name, href) {
    var href = decodeURIComponent(href)
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = href.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
module.exports = {
    getEnv: getEnv,
    getQueryString: getQueryString,
    saveCaseResultToDataBase: saveCaseResultToDataBase
}
