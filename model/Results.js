var mongoose = require('../common/db.js'),
    Schema = mongoose.Schema;

var results = new Schema({
    runSign:{type: String},                     // 一次跑的标示
    caseId: {type: Number},                    //用例ID
    caseResult: {type: String},                        //测试结果
    memo: {type: String},                        //日志
    databaseType: {type: String},                       //测试的功能库
    innerTime: {type: Date},                     //插入时间
    status: {type: Date},
    errorMsg:{type: String},
    env:{type: String}                          //用例环境
});
module.exports = mongoose.model('Results',results);
