const https = require('https');
const http = require('http');
const url = require('url');

var test_url = "https://www.economist.com/leaders/2018/08/02/the-world-is-losing-the-war-against-climate-change?cid1=cust/ednew/n/bl/n/2018/08/2n/owned/n/n/nwl/n/n/ap/140375/n";

const options = {
    headers: {
        'Content-Type':'text/plain',
        'Origin': 'https://www.economist.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
    }
};

//为什么不能直接返回rawData? stream的工作流程？
// function getArticle(article_url, options){
//     // var article_html = '';
//     var request = https.get(article_url, options, (res) => {
//         let rawData = '';
//         res.setEncoding('utf8');
//         res.on('data',(chunk)=>{rawData+=chunk;});
//         res.on('end',()=>{
//             // return rawData; //return undefined
//             // article_html = rawData; 
//             console.log(rawData.length); // display normal
//             // article_html = rawData;
//         });
//     }).on('error', (e)=>{console.log(e);});
//     // request.end();
//     // return article_html; // return ""
// }

// console.log(getArticle(test_url, options));

function onRequest (client_req, client_res) {
    // var article_url = test_url;
    var article_url = url.parse(client_req.url, true).query.article;
    var proxy = https.get(article_url, options, (res) => {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data',(chunk)=>{rawData+=chunk;});
        res.on('end',()=>{
            client_res.writeHead(res.statusCode, res.headers);
            client_res.end(rawData);
        });
    }).on('error', (e)=>{console.log(e);});
}

http.createServer(onRequest).listen(8080);

// http.createServer(function(req,res){
//     var article_url = url.parse(req.url, true).query.article;
//     var article_html = getArticle(article_url, options);
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.write(article_html);
//     res.end();
// }).listen(8080);