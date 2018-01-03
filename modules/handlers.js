let fs = require('fs');
let formidable = require('formidable');

exports.upload = (req, resp)=>{
    console.log('starting upload');
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=>{
        if(!err && files.upload){
            fs.renameSync(files.upload.path, `./uploads/${files.upload.name}`); //cross device link error fix
            fs.readFile('./templates/upload.html', 'utf-8', (err, data)=>{
                resp.setHeader('Content-Type', 'text/html');
                if(!err){
                    data = data.replace('$$uri$$', `/show?name=${files.upload.name}`);
                    data = data.replace('$$filename$$', `${files.upload.name}`);
                    data = data.replace('$$filesize$$', `${(files.upload.size/1024).toFixed(2)} KB`);
                    data = data.replace('$$filetype$$', `${files.upload.type}`);
                    resp.write(data);
                }else{
                    console.log("upload error: ",err);
                    resp.write('error reading upload template');
                }
                resp.end()
            });            
        }else{
            console.log("error:",err);
            resp.write('error parsing form');
            resp.end();
        }
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
    console.log('routing error/unknown endpoint');
    resp.write('404 - not found');
    resp.end()
}

exports.show = (req, resp)=>{
    console.log('image request');
    let name = require('url').parse(req.url, true).query.name;
    fs.readFile(`./uploads/${name}`, 'binary', (err, data)=>{
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

exports.styles = (req, resp) => {
    console.log('serving styles');
    fs.readFile('./styles.css', 'utf-8', (err, data)=>{
        if(!err){
            resp.write(data);
        }else{
            console.log('style read error:',err);
            resp.write();
        }
        resp.end();
    });
}