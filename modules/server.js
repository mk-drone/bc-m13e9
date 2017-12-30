let http = require('http');
let colors = require('colors');

let handlers = require('./handlers');

function start(){
    function onRequest(req, resp){
        console.log(`received ${req.method} request: ${req.url}`);
        let url = require('url').parse(req.url, true);
        switch(url.pathname){
            case '/':
            case '/start':
                handlers.welcome(req,resp);
                break;
            case '/upload':
                handlers.upload(req, resp);
                break;
            case '/show':
                handlers.show(req, resp);
                break;
            default:
                handlers.error(req, resp);
        }
    }
    http.createServer(onRequest).listen(9000);
    console.log('Server is running on port 9000'.green);
}

exports.start = start;