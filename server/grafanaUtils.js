
var request = require('request');

function authorizeWebApi(url, authData)
{
    return new Promise(function(resolve, reject) {
        request({
            url: url + '/login',
            method: 'POST',
            jar: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                //'Authorization': 'Bearer ' + grafanaKey
            },
            body: JSON.stringify(authData)
        }, function(err, response, body) {
            if (err || response.statusCode !== 200) {
                reject(err || (response.statusCode + ' ' + body));
                return;
            }
            resolve();
        });
    }).then(function() {
            console.log('logined successfully');
        }).catch(function(err) {
            console.error('login failed ' + err);
            process.exit(1);
        });
}

function createDataSource(url, options)
{
    var json = {
        "name": options.table,
        "type": "influxdb_08",
        "url": options.url,
        "access": "proxy",
        "isDefault": false,
        "database": options.table,
        "user": "root",
        "password": "root"
    };

    return new Promise(function(resolve, reject) {
        request({
            url: url + '/api/datasources',
            method: 'PUT',
            jar: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                //'Authorization': 'Bearer ' + grafanaKey
            },
            body: JSON.stringify(json)
        }, function(err, response, body) {
            if (err || response.statusCode !== 200) {
                reject(err || (response.statusCode + ' ' + body));
                return;
            }
            resolve();
        });
    }).then(function() {
            console.log('created ' + options.table);
        }).catch(function(err) {
            console.error('failed ' + options.table + ' ' + err);
        });
}

module.exports = {
    authorizeWebApi: authorizeWebApi,
    createDataSource: createDataSource
}