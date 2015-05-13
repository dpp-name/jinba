

var schema = require('./schema.json');

var grafanaUtils = require('../server/grafanaUtils');


var GRAFANA_URL = 'http://dbh50.mlan:8080';
var INFLUXDB_URL = 'http://dbh50.mlan:10086';

var sequence = Promise.resolve();

sequence = sequence.then(grafanaUtils.authorizeWebApi.bind(null, GRAFANA_URL, {
    "user":"admin",
    "email":"",
    "password":"admin"
}));

for (var name in schema.reports.tables) {
    var dbName = name ? schema.reports.table_prefix + '_' + name : schema.reports.table_prefix;
    sequence = sequence.then(grafanaUtils.createDataSource.bind(null, GRAFANA_URL, {
        table: dbName,
        url: INFLUXDB_URL
    }));
}

sequence.catch(function(err) {
    console.error('failed ' + err);
});
