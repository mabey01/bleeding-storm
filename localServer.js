var http = require('http');
var fs = require('fs');
var path = require('path');
var directory = "local/";
var port = 8080;

http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = 'index.html';

    filePath = directory + filePath;
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end('Sorry for error: '+error.code+' ..\n');
            response.end();
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);
console.log('Server running at http://127.0.0.1:'+port+'/');