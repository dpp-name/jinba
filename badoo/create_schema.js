
var mysql = require('mysql');

var pinbaSchema = require('../server/pinbaSchema');
var schema = require('./schema.json');

pinbaSchema.config(
    schema.reports.percentile1,
    schema.reports.percentile2
);

var mysqlClient = mysql.createConnection({
    host     : 'pinbajs.mlan',
    user     : 'pinba',
    password : 'pinbapass7',
    database : 'pinba'
});

var sequence = Promise.resolve();

for (var name in schema.reports.tables) {
    sequence = sequence.then(pinbaSchema.createReport.bind(null, mysqlClient, schema.reports.table_prefix, name, schema.reports.tables[name].tags))
        .then(function(name) {
            console.log('created', name);
        });
}

sequence.catch(function(err) {
    console.error('failed', err);
}).then(function(){
    mysqlClient.end();
});
