
var http = require('http');
var url = require('url');
var fs = require('fs');
var staticServer = require('node-static');

function startWebpack()
{
    var webpack = require('webpack');

    var config = require('./webpack.config.js');

    var outputOptions = {
        cached: false,
        cachedAssets: false,
        colors: true,
        context: process.cwd(),
        chunks: true,
        modules: true,
        chunkModules: true,
        //reasons: true,
        errorDetails: true
    };

    var lastHash = null;

    webpack(config, function(err, stats) {
        if (err) {
            lastHash = null;
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        if (stats.hash !== lastHash) {
            lastHash = stats.hash;
            process.stdout.write(stats.toString(outputOptions) + '\n');
        }
    });
}

startWebpack();

var file = new staticServer.Server('./');

function httpRequest(req, res)
{
    console.log(req.url);
    var params = url.parse(req.url, true);

    if (params.pathname === '/jinba/') {
        var postData = '';
        req.on('data', function(data) {
            postData += data;
        });
        req.on('end', function() {
            console.log(require('util').inspect(JSON.parse(postData), {depth: 10}));
            res.end('Ok');
        });
    } else if (params.pathname === '/demo') {
        setTimeout(function(){
            var N = 1000;
            var buffer = new Buffer(N);
            var fd = fs.openSync('/dev/urandom', 'r');
            fs.readSync(fd, buffer, 0, N);
            fs.closeSync(fd);
            res.write(JSON.stringify(buffer.toString('base64')));
            res.end();
        }, params.query.page === 1 ? 1000 : 2000);
    } else {
        req.addListener('end', function () {
            file.serve(req, res);
        }).resume();
    }
}

http
    .createServer(httpRequest)
    .listen(8001, '0.0.0.0');

console.log('Server running at http://0.0.0.0:8001/');
