//立法沿革自动化校验 验证168条法规的立法沿革正确性
var request = require('request');
const alphaConfig = require('../common/envConfig');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var wellknown = require("nodemailer-wellknown");
var config = wellknown("QQ");
var lidMaps = {
    "794323d740745ddb394e3086adcc3546": "eb220056fe20983ce9245eeb2d13711c",
    "72c99125809a8e6c9772d5534fec9b85": "3896c931af8de8659c1d288e6ecb0642",
    "6b9337500c2394690ddbef2119b770ed": "9fbe2069f8d47100a5002bc2382660f1",
    "4f7e5268940c7b538bbc6870110e0ee9": "633c778e02f20439a8f4b235764f44da",
    "4e75511753a998d97f2ff695b9270ffb": "e5a4dd6b235dc18e1eb1e70b719e9a6d",
    "c65623177ce261a2fba1708e9ddecc8a": "3e2efca8dfe902f0969729f1ca1550cf",
    "a10ef273ff463e06eddf0cd1b3ad91f7": "d751713988987e9331980363e24189ce",
    "af68aad597be0e73f6f304e8287ffbd7": "1937bcdbeda590f9355170829c7a00f4",
    "f94417e3490306fd2b9305c8279c79b8": "cceda82db34d05fb7ed4d383e193665e",
    "cbd024db518c2a7f7f568871a140012c": "38f7076d186a2f56beb56290fc5bc2a4",
    "86a26427de3bc619b58a5453cd93bc8b": "bc64d03dfa22afddcf98fd39abcf94b0",
    "1ceb34bc997326f763129907439e354": "59808d8641e59260a4c032ce8afb96dc",
    "dd0c51eeb6acffe01b6fbfeda1af507f": "547a2e12d7904783b6b8a2797f453209",
    "9620c86afd7660ed6787dce80a0c1865": "4c4232a1b39dc1b3f299efa4bc3b34ae",
    "fcb36e73173c8f2ebfa8bb7b35ca3239": "696f20b6b54e3c76513df83bc3888d11",
    "8b964b7ae1922265e62d9d59ab13a43a": "98db541982b3349e24437252855bb310",
    "51da7bed80d666af0c64a6d2615d93ac": "d76591ae4cbea37222cdd914ef393838",
    "74f1b20803f9880b2550d615eb035fa3": "f9bc23cea48970af3512abef4e31dde2",
    "1ee7bed8a697f94b44903e99f9542ee6": "33fc5004f7345872fb6168608a3dc703",
    "646153feaa7e35541f3f3d812c44b53d": "c7c9bcb41e0c4b1efce2fb97be57ba2e",
    "736c9bd1706620defccdefe4b1b73656": "aa1cc31e84eb34dce28962faadcc0c9b",
    "15bd62deef3031e99b1d54e41f4f78b5": "62bebea4062a3216272332cb3632fc01",
    "afa4162b60c7a2c93cdbe53f090ffce2": "4844e171995300997b8dca7714205b80",
    "5405b7eb751b0f6ca699a9987db6d617": "54495cf07ea1194d54456c6bf886ca72",
    "9c47e529a87a08563b9409390225e772": "6c7d7727baffa44f4da021db265875fd",
    "ec06cf1d50f7c110895182f2bdff72e": "561136e22265f61e1c7850ed502cc4a6",
    "eef808804da8254ab0e8246480d9fdb6": "f9700c791a3624f47aba0c6ea08de6d5",
    "d7fa1f5534b2188ab6fe714c6569332b": "f2459d82dc5a6e9407594748e8043824",
    "6c429e7283515f6da485a5b5cc458857": "265c2c3a3ff6b4c179f4de8e4e9477e5",
    "20773f6c8ae45942adc20150297370d1": "e39e21debf28277d61902c4a07db31dd",
    "d07e5ef9a6e9e9eb7268524ab092e759": "7ac76289b4f3244fed7ed821395b6b61",
    "12f577198fcdc14cf85d6169d40236a3": "8ea2afad1032022db3d24862b47c8d67",
    "8f5e6270328056d0359739e8d22d6cca": "5a66589b1019b3299da1ba53b74b274a",
    "4779d9e11a257e2d00e244512215f874": "e1e8e8a506c793740e27b43e5742a4ed",
    "c255c441cc8646116ddbc54bbca3888b": "1a0d9aea5e0d3dc78f8be7bc2f82348b",
    "6ced25a01a896229551074a02baf67a2": "947f511569060959ed62dd8f14c34182",
    "1294d41d76eb10b96a13e7215eca6ae4": "ac80af60fcfa1fa6dcfd9fc752494e86",
    "ef930d030b6ca6000f8d713c9f59d711": "95b634c631910af67248f665db525d2b",
    "5e506dc6aea9da133ed529c367ed64b0": "8a570977da15e8c981020cc0f3f11591",
    "c1bc9a55aa77fc50f096e2900d68374e": "479f92bdceb51cc7dc32ac7df16b85ff",
    "97fab8dd45b3f4466395661b3d20efd6": "b691a984c0c2a5ee4c1041516ba36223",
    "ab495cf5d62813d68960200eacd22533": "b74fd2a87954eca18c103ea61aacacab",
    "b0fdba7f824194af537c82b36aa8a8e5": "c5a3dfe754e426853aba43bdbf462f25",
    "d0823bb2168013f3b4dda9808d39c51b": "0e0bdcc23f8e2666cf4ae5656dd446a4",
    "a921bd30042cab4ee0a1b7fbd0699dee": "62ad39355d333a84d531bf58ea49c528",
    "3e9dd8ceff1e2c12d61ff9bf67b8b60c": "b0bc1581f397c076cfd748a30243b6d1",
    "d7ad2c236e3879995e9daee31ece6f3e": "8fd80ccf4bc160b52732880ccdf760a4",
    "49953779e753c6265842b6486ab6380d": "8574e2e122f69aea5b53cde592bb8d95",
    "4c6a6107850009545837003202d35c2d": "8d7379ab402b51e07c0e04b8f0390eb2",
    "c2b0127f4e3c8d287620b453997a0e96": "f1118182628366095cdb02e1e1f9016b",
    "6d00534fe510516e2b73ac1632c35674": "55534b0c0fc6f952b490d673b26579d2",
    "1d174b763224c702261bf00271b5e338": "d930b5019f0cb63732b3c7d1d157ab01",
    "e7a460de13d680d14d0fe3e99bc91f6d": "624bb613cad591926c9b3d06aaa525d7",
    "4b798ad3228f6b428b0b4ad414dbccb6": "0eff86786d78c9f3ca229e8c3b52d064",
    "193c531dd9bff622fdc17c6bfb09c085": "93c7eefc9d110be72f661e3e0c4b9d79",
    "20e152e9d3e771bb68fcf0f4bc1eb1f0": "0eb280ff050f1c0596c20c1080657501",
    "f114c3d7a128d81cdbf47ebb9039dd30": "ad7aa3fbaaa1a4766e4fc68f548a5558",
    "c6d2f3f551b5bcfb29a5f5e6c117fd1e": "ed0a245179440267bbec7a66b5c72fee",
    "2fe33d8f8f8535eddf0484e4220ad6e5": "43f11f5cdad902b857ecc7abc56f61bb",
    "4b452fd89be49841ad5ccace34775b5e": "c256e203f500cb27f3d718e8a69024c3",
    "44fb1abb92eacf56d7b0429eef094e9a": "0265e6adcfa09ded67531d2eabe92a19",
    "32de02d7b8177d1239757a4388546e4d": "87675156d66c0903fc340509769bba37",
    "8dc1cf8bfdad913643ab326877848fa7": "c5185697cfe9aa5d3a6a70960223b7c2",
    "b1b534de672c163d69ac4a0e542edfba": "472afa7682e6b2a3b08bee6bc09cc0ef",
    "856aa7662734b7eecfb58344f892aa34": "362d213bce873fae60beec7cbd776aaf",
    "15e4acaf477a48716978cff0f5d3af18": "6d13fc1a5789b3dd6ada6585006e349b",
    "d715f7706dc817f3d66331f6d9f1e9ba": "a26f94d784498aea836bbca7628e3894",
    "9b633e28b65cc5cf933d481320f4e72d": "abb6859971425c91f181a19c5436e49b",
    "a9baf95ef8b151c97d926050ed89eb17": "218529320930ec2edc1c70bb416d2f00",
    "12e110db13c497bb342275bbbcad2b0f": "134e0a621a044c394d8ce01da04b28a7",
    "c712a956d87f95580e9bd23b7d8d27cf": "8765f288eded90c1dafcec6491aee57a",
    "b4a161ccf5af7b1b3b89a83fe1fc127f": "c07944762aac3252dd3797b80f8e3485",
    "b4662843e583f1d83ff8c49afb0a8521": "f949f4795746296fe6ca0a6a29b21895",
    "fc3cedb7d34d60751316133f0166b0d4": "e9b34caa5c6f7a168ef779263848d357",
    "bc1dc0e5d8450b19a75ed1d7eafbde26": "2223524ac9f3048472aff0163435c2f9",
    "12196a6df7e3d0f75810522d177e0e9d": "cbe74074c7311de7b9a695f61dc6b2c2",
    "969daf6f6bea38620c53bd2a6e161d61": "7d92cbf4a42b65cf19a53af22817f6ff",
    "8d1fd7b8c4cd11c57e836044c13c0f3c": "e9a11a57e401b68f15eff001894c1b7d",
    "740de342ca505b6359f3640fc959d9b7": "8c5d790a492358d1b7acfcf94c668359",
    "671ec41f06ed900757d826e5743a632b": "bc32694793181208b44f258483471a7c",
    "a6a00416c21608084d4a21928bc0bad6": "f91bdb25c9d8dcdddf738ce57b32dedb",
    "1777db0e69f73b5a0e42cf5a1d754686": "4c140bda98cd2c7d31f629a7efc80c68",
    "a1eb1202947edcf7f8222807bbdd834c": "1efed9d686152aa41c2aa311419f6d7c",
    "6afe839f3c062b6513952f35709fd80a": "6ec311820d4b19acb109a27263fd3822",
    "876101feb63c6bed0d120adb9131a5b1": "479b49f4dae0df3f0656e000d93656ee",
    "30e10722f46d8196767f7fc71eb7d4c6": "8c1ef263da172bb76aea33c1f858c29b",
    "aa9920f097d4e443ebc25ca5563407f4": "8401dfc9cb6a3c3376ae34817590d4de",
    "243bfa1e21603a9ff326f14f1f9c7696": "99a345a778d01555c88d3c092e63571f",
    "2e056c7373f4566c6e09c301c9809d8f": "6c0023eae5fdcb042f5be71a93869e91",
    "ffea73c28217cd43a4aee4c4f16550d4": "2ef7246d5ce15c60e67155838789b522",
    "ea57c23af34c2bd2932f987f3bc77bd6": "c67f250cd4c0c7c2e1db6d879eda10c9",
    "85fc335bc04ae7104a3d11b34be33833": "adfc8bfa1f0772258303f8880a2e3c9d",
    "48a8c9802671377188acd73cf2ab474": "b90d222591ce58cfd168ab29962f842e",
    "a67c09d9f1e96ac3f1921c420857c982": "bdbf97ab642662b43490adb58402bec5",
    "f898bc5b27cf16791d636f5657eb9a2a": "6de1787bc57bd6a788e2417cf470a6c2",
    "2dbe8b415951f74d2809f4f7acf601a8": "0ac30342380ae8c274adf79e9b59f5ef",
    "c939f22eb5eceb5377bdb4ffa93abde9": "0b17e54f502e0816662c253f020e1810",
    "c621a6cea519aba1dae76ef1a4cba55c": "1b408a74b848b64e2ee1440df67d7e65",
    "5b6a1dcab86a565bb1dd9f11022ab014": "735f42a2bd2f70321213d311e956cdda",
    "37b04543ffefcea327c67612165663c1": "156a4a02bf4eeabca59fda9b1b77a44d",
    "44c4a467e55a0cbe1014f6b5cbd82a1b": "9152b42bdcd5c41b64d53199a63ca7aa",
    "2b2123b1e6f28afd8ea87197a054e699": "079a9fbfcc77108835dbcabb0a01c3ef",
    "40e03961e3fd3820939df0d7db5375b5": "a26d8f2ffae1933b387d9ca5e014205d",
    "6cf6c01464002a4d6521a9e84b2e3945": "9a535109465a131f29f4678984eeba88",
    "6d3af2571810e023783a55b48f9960da": "6b51b4c9cf8419a7cd6e879986e27b12",
    "c70cfccb17cf95332bca9d7732359c23": "8b32917614f3643525693c9d79543dbd",
    "af23decc1a507fcaa1878d3e87561cba": "ce06b6140edce527bc8cf0513273f506",
    "6c51280947bc9f1ae29f0470a107a4de": "5da6aad860806d7a80660613c75091cf",
    "fbe2acae6f959c78a5e370705c358b8c": "ca2359965984b9947bfddf87312ab9c3",
    "71f0878fc148cd018e80f01634d12a11": "2848fe3d0f40e4108795c347dd613cc0",
    "8b8348e8cce4ad41889687e9ab9350e8": "9afe4f1c80ffe187c5e038ed197a383f",
    "8c4db2214550137966273373c6530731": "b7ccd0e96affc2cb079999c1b4356224",
    "8c83ce55e50155999a35dfe22c3d291c": "4140467ee0c0a855cd68d1ac347789e5",
    "8d1897ba0ed6c5c4e100220bc398b4ba": "7b0b918335170890d39e345319ba74bd",
    "8c51c2ce054aa521dd7e14a6b6ed7ec4": "6e196df110b02a4c7b2dfa90ebf95431",
    "c25fdbed8918731a703aa3d1e9f4446b": "f3d182097caef98b4f22eff9b0cad6b4",
    "68bc4d4bb13a9e949cb66e76a571bd4c": "5a0ad1ee814b2c0247b9527d74fd7506",
    "8c29150a870d0bcd2cbbd164c2411dc5": "56716e56fd7266f374dfa8605d45402f",
    "852e1443964dd4ede16c4d906c6bbdb": "107cccf3ee3e82c7ae9de16a39b9f404",
    "b41b7f746859e74e9ce5d65023bd2b7": "ffcfe2b58ca2f92556290152ade5c794",
    "b4021120a27e8b598a7d11da6630d2c3": "37c2ccdf88a9067563ccd9016acd86d6",
    "ed949e7a15c84dead041d36bd5394278": "7c15c5e4d6ec471213880a352ff76b1e",
    "9bf563bf94125c2146890d3f726672c": "c9234bf832146accfa218ae5d84e4795",
    "86ad4be9551eb326de4eacb564a970a0": "0ed83fbbe394da6564e6d9bb2e3a0034",
    "6772306c6ae3ece55dc0c34b3cbaa93f": "0d56a73d7c96d878788abada3119770c",
    "12ad59cb01a18b7da95e4e0ba5c8460c": "6887db603e844fd4916ba4d9deb58f94",
    "97a58c138078fae18c1ce2d5c3fceca2": "0fc7de3ff1b73422de75781a4a5c59af",
    "5428be1c799400696e1aa979d6bb1531": "a64f6f2f00925a869053145b8d069dc5",
    "e705273b5f0202dada141cefeda5a831": "ca97328eed9bdc6129a98c34770a4d2a",
    "4bb43d0fe47503c4b6d77e5ede475aa1": "f8291ab0df16fc8663a2db0e261eb7f6",
    "1f025e96f6cfbd23a48dc22883317fec": "4cd2933f1a5ab945a7444d1539bf5452",
    "96e15b4ffaf2c36b74d7380508f9e45": "89af1acc8391a1c9e40009afbb3f305f",
    "866e4451d93b2911fec00c49d1d980cb": "2285e0d86c0c2a090129351a8022bf76",
    "bfde8f3b99e57c26493b0e4b99bca984": "3906684803dfb43d8341570e7cf0b2fc",
    "47935848148388a3e739cfbbb40d69b9": "f238b66c42b4d848760215ba477831bc",
    "98da5f19b290baa83f4606a7c14ed2c8": "dd8c384d8ca3202557ba0ea1a95bab0e",
    "8d1f2d8d9a5b52d6260d2f27740e2dc8": "84c6360e7efee89789452d910a0ba5c3",
    "a54c1080c717cf42dd2069172df448bf": "1d265e086a55aa5e31ccc6c0825ce227",
    "587da67a959654640b1d257a67a75240": "9e27074589fce49b3b253c3ee2d2ac3b",
    "237bfee4dca252c89d407ba074aec4a2": "45ba8fbb444c878f48c303beac64cffc",
    "29c4e1806435ccc9c81c85af34f1496": "a2330a48fb8d38b781d6ab835e8c322d",
    "56c001720eb4bed7007d1db4a48771b1": "15041f26d76c8d6bc22bcb7f2a45ad87",
    "3c5f4a6c10ed7653bbfa793ffc590134": "4fe15f424e3fc5da0495f3e978cf7c5a",
    "9b90be673ffb78f9bd97b710900484df": "95416de119ae99f2cde2779775ca8a5d",
    "4f0308560fa6a7d95f24e8606fc800d6": "7a4e55882d48fbf732b2bdab8c187785",
    "f7fcbaf873aacd9f5bb161ab94fb4713": "c9e35a59b77d1cb89f7cbd513de806d5",
    "4a2f652029b9414f20962076ae77e101": "2e5f7b16af37d9a85262846ef53d28b1",
    "c799b04aa5c883576105663d9cf63d1f": "51391839aac1aaedc0da0ad5d0be75fe",
    "9e08dcc48f5cd599871fb5e6fb225abd": "afb8ebdd3abe21c2fac567b09c0c674c",
    "644465c2084915802811d3d9a15181e2": "e458b6c5dc4270870a9bb7975ae5b0a0",
    "37dae7390ee59502bc031109a1e1df89": "0f8b3ecfc73433eac879b16fcffdb0f1",
    "62674701c9272bed6b34679012e9298": "af3031ea83d3a1b2b2d0c36f0e177bf2",
    "af8babb37bc81e296683d6255ac9312f": "ef0ccac33e3b92780c1b65b519c1a025",
    "9cd7743a8a3d051c4d4987351dcd0544": "0ba88715ffab801a727a9a8bc51d3b39",
    "853724969a82777fb5bffee135c8d19c": "660a74586a091824b297b6398d1eb2cc",
    "41923f470bcb9d8c9e166d83919c78a4": "55385cbe11b93f00fb2d61ffaf7dd6ee",
    "1b7719c3237d194e8a9f7c1a57f6543f": "e22d3c77c02f3e7445d6501057121827",
    "3481f9776427089a2f28dd2289cdab4e": "06fd82a3b30201784c983f9d9d4e04bd",
    "fa26750330ae82fa6d7d005fd0038f7e": "9f83dc05259a40b63258d5b643be4010",
    "faf7d5cd4fc6aba6859bfe8863386a75": "77cc6cbe1efea1ded8d3b2f472f9cf57",
    "535604bd34eec04aa661dafc36761dbe": "2170de73b4428a87adfb9b1122493318",
    "c79584e35cda0b91a7337be6d48c9977": "f53157fa6c24a36984fd8098f1522a61",
    "d08c5ad9f07b6ab3bc656fa34c15d95f": "a23fb467d24075a052ab20a506ed84b7",
    "585ea379be54d8e0d76b629877b07d8d": "0b6055837b92c1c9e2d1d0b6b8b227af",
    "9d35092fac60325b52ca1c2bfbb61caf": "8e15b4af0a207733eb68d0344abf83e4",
    "f045018454414f889d9065813bd8d39a": "f83baf4871913a78d5cc9b173089c8c9"
}

function objKeySort(arys) {
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();
    //console.log('newkey='+newkey);
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]];
        //向新创建的对象中按照排好的顺序依次增加键值对

    }
    return newObj; //返回排好序的新对象
}

const puppeteer = require('puppeteer');
const Json2csvParser = require('json2csv').Parser
config.auth = {
    user: '479182117@qq.com',
    pass: 'scsdtpcnyyrmcahj'
}
var transporter = nodemailer.createTransport(smtpTransport(config));
var sendmail = function (html) {
    var option = {
        from: "479182117@qq.com",
        to: "zj2007011567@163.com,479182117@qq.com",
        subject: '来自大数据自动化测试的邮件（立法沿革）',
        html: html,
        attachments: [
            {
                filename: '立法沿革错误信息.csv',
                path: 'lawEvolutionError.csv'
            }
        ]
    }
    transporter.sendMail(option, function (error, response) {
        if (error) {
            console.log("fail: " + error);
        } else {
            console.log("success: " + response.messageID);
        }
    });
}

let responseMap = {}
let errorMap = []
let md5 = require('md5')
var fs = require('fs');
jest.setTimeout(100000000);
function logRequest(response) {
    let url = response.url()
    if (url.indexOf('ilawregu-search/api/v1/lawregu') === -1) {
        return
    } else {
        response.text().then(function (textBody) {
            let lawDetail = JSON.parse(textBody).data
            let lid = lawDetail.lid
            var sortedLegislationHistory = []
            lawDetail.legislationHistory.forEach(function (item) {
                sortedLegislationHistory.push(objKeySort(item))
            })

            let hisMd5 = md5(JSON.stringify(sortedLegislationHistory))
            responseMap[lid] = hisMd5
            // fs.writeFile('final.json', JSON.stringify(responseMap), 'utf8', function(){
            //     // 保存完成后的回调函数
            //     console.log("保存完成");
            // });
            if (hisMd5 != lidMaps[lid]) {
                var errorObj = {id: lid, title: lawDetail.title, eff_level: lawDetail.eff_level}
                errorMap.push(errorObj)
                fs.writeFile('lawEvolutionError.json', JSON.stringify(errorMap), 'utf8', function () {
                    // 保存完成后的回调函数
                    console.log("保存完成");
                });

            }
        })
    }

}

let browser, page;
beforeAll(async () => {
    //获取全局会用到的变量
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    page.on('response', response => {
        logRequest(response)
    })
    await page.setViewport({width: 1400, height: 800});

    //登录
    await page.goto(`${alphaConfig.env}#/login/password`);
    await page.waitForSelector('form[name="loginForm"]');
    await page.type('input[name="username"]', alphaConfig.userName);
    await page.type('input[name="account_password"]', alphaConfig.password);

    const navigationPromise = page.waitForNavigation();
    await page.click('.login-button');
    await navigationPromise;
    await page.waitFor(3000);

});
async function goDetail(id) {
    await page.goto(`${alphaConfig.env}#/app/tool/lawsResult/{[],}/detail/{${id}, }`);
    // await expect(requestStringArray[0]).toBe('全文:物权');
    await page.waitFor(1000);
}

test('跳转到法规详情页面', async () => {
    var keys = Object.keys(lidMaps)
    for (let lid of keys) {
        await goDetail(lid)
    }
});

afterAll(async () => {
    let fields = ['id', 'title', 'eff_level']
    const json2csvParser = new Json2csvParser({fields});
    const csv = json2csvParser.parse(errorMap);
    fs.writeFile('lawEvolutionError.csv', csv, 'utf8', function () {
        // 保存完成后的回调函数
        sendmail("邮件内容：<br/>这是法规立法沿革的测试数据");

    });
    await browser.close();
});
