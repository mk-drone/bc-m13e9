let fs = require('fs');
let formidable = require('formidable');

exports.upload = (req, resp)=>{
    console.log('starting upload');
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        if(!err && files.upload){
            fs.renameSync(files.upload.path, `C:/upload/${files.upload.name}`); //cross device link error fix
            resp.setHeader('Content-Type', 'text/html');
            resp.write('received image:<br/>');
            resp.write(`<img src="/show?name=${files.upload.name}">`);
            resp.end()
        }else{
            console.log("error:",err);
            resp.write('error parsing form');
        }
        resp.end();
    });
}

exports.welcome = (req, resp)=>{
    console.log('starting hello');
    fs.readFile('./templates/start.html', 'utf-8', (err, data)=>{
        resp.setHeader('Content-Type', 'text/html');
        if(!err){
            resp.write(data);
        }else{
            console.log(err);
            resp.write('error reading start.html');
        }
        resp.end()
    });
}

exports.error = (req, resp)=>{
    console.log('error display');
    resp.write('404 - not found');
    resp.end()
}

exports.show = (req, resp)=>{
    console.log('image request');
    let name = require('url').parse(req.url, true).query.name;
    fs.readFile(`C:/upload/${name}`, 'binary', (err, data)=>{
        if(!err){
            resp.setHeader('Content-Type', 'image/jpg');
            resp.write(data, 'binary');
        }else{
            console.log(err);
            resp.write(`error reading ${name}`);
        }
        resp.end();
    })
}