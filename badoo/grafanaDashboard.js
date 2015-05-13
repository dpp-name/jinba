
var schemaUtils = require('./badooSchemaUtils');
var grafanaUtils = require('../server/grafanaUtils');

var grafanaKey = "eyJrIjoiVkJIUGhiYlpZOWoxa1ZEQlR5dmF1WjFNSDA2eDdZaDciLCJuIjoiYWRtaW4ta2V5IiwiaWQiOjF9";

var GRAFANA_URL = 'http://dbh50.mlan:8080';

Promise.resolve()
    .then(schemaUtils.getSchema)
    .then(function(schema) {
        var sequence = Promise.resolve()
        for (var name in schema.reports.tables) {
            sequence = sequence.then(grafanaUtils.createReportDashboard.bind(null, GRAFANA_URL, grafanaKey, schema, name));
        }
        return sequence;
    }).catch(function(err) {
        console.error('failed ' + err);
    });