var http = require('http');
var fs=require('fs');
var url = require("url");
var path=require('path');
var mine=require('./mine').types;
var storage=require('./storage');
var routes=require('./router');
var querystring = require("querystring");

http.createServer(function(req, response) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == '/') {
        pathname = '/index.html';
    }

    var realpath = path.join(__dirname, pathname);
    // console.log(">>> realpath="+realpath);
    var ext = path.extname(realpath);
    if (req.method == "POST") {
        // console.log("CONTENT TYPE=",req.headers['content-type']);
        var body='';
        req.on('data', function(data) {
        	body += data;
        	if (body.length > 1e6)
        		req.connection.destroy();
        });
        req.on('end', function() {
        	// readFile()
            // console.log('>>> data = ' + body);
            var infoObj = querystring.parse(body);
            // console.log('>>> data = ' + infoObj.info);
            response.writeHead(200, {'Content-Type' : "application/json"});
            response.end(storage.save(infoObj));
        });
    } else {
        ext = ext ? ext.slice(1) : 'unknown';
        // console.log(">>> pathname = " + pathname);
        // console.log(">>> realpath = " + realpath);
        fs.readFile(realpath, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type' : 'text/plain'
                });
                response.end();
            } else {
                var contentType = mine[ext] || "text/plain";
                response.writeHead(200, {
                    'Content-Type' : contentType
                });
                // console.log("Request pathname = " + pathname + " ext = " + ext);
                // console.log("contentType = " + contentType);
                response.write(file, "binary");
                response.end();
            }
        });
    }
}).listen(8888);