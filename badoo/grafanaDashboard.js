
var schemaUtils = require('./badooSchemaUtils');
var grafanaUtils = require('../server/grafanaUtils');

var grafanaKey = "eyJrIjoiVkJIUGhiYlpZOWoxa1ZEQlR5dmF1WjFNSDA2eDdZaDciLCJuIjoiYWRtaW4ta2V5IiwiaWQiOjF9";
var GRAFANA_URL = 'http://dbh50.mlan:8080';
var INFLUXDB_URL = 'http://dbh50.mlan:10086';

Promise.resolve()
    .then(schemaUtils.getSchema)
    .then(function(schema) {
        var sequence = Promise.resolve()
            // Authorize in grafana WebApi
            .then(grafanaUtils.authorizeWebApi.bind(null, GRAFANA_URL, {
                "user":"admin",
                "email":"",
                "password":"admin"
            })).then(function() {
                console.log('logined successfully');
            }).catch(function(err) {
                console.error('login failed ' + err);
                process.exit(1);
            });

        for (var name in schema.reports.tables) {
            var dbName = name ? schema.reports.table_prefix + '_' + name : schema.reports.table_prefix;

            sequence = sequence.then(function(name, dbName) {
                return Promise.resolve()
                    // create data-source
                    .then(grafanaUtils.createDataSource.bind(null, GRAFANA_URL, {
                        table: dbName,
                        url: INFLUXDB_URL
                    }))
                    .then(function() {
                        console.log('created ' + dbName);
                    })
                    .catch(function(err) {
                        console.error('failed ' + dbName + ' ' + err);
                    })
                    // create dashboard
                    .then(grafanaUtils.createReportDashboard.bind(null, GRAFANA_URL, grafanaKey, schema, name))
                    .then(function() {
                        console.log('created ' + name);
                    })
                    .catch(function(err) {
                        console.error('failed ' + err);
                    });
            }.bind(null, name, dbName));
        }
        return sequence;
    }).catch(function(err) {
        console.error('failed ', err);
    });
