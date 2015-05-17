
var start_time = Date.now();

var mysql = require('mysql');
var influx = require('influx');
var prettyMs = require('pretty-ms');
var pinba2influxdb = require('../utils/pinba2influxdb');
var schema = require('./schema.json');

var mysqlClient = mysql.createConnection({
    host     : 'pinbajs.mlan',
    user     : 'pinba',
    password : 'pinbapass7',
    database : 'pinba'
});

var influxClient = influx({
    host     : 'dbh50.mlan',
    port     : 10086, // optional, default 8086
    username : 'root',
    password : 'root'
});

Promise.resolve().then(function() {
    return pinba2influxdb.createInfluxDatabases(influxClient, schema.reports);
}).then(function() {
    return pinba2influxdb.exportData(mysqlClient, influxClient, schema.reports);
}).then(function(total) {
    console.error('[OK] ' + total + ' points in ' + prettyMs(Date.now() - start_time));
}).catch(function(err) {
    console.error('[FAIL] ' + err + ', ' + prettyMs(Date.now() - start_time));
    process.exit(1);
}).then(function(){
    mysqlClient.end();
});
