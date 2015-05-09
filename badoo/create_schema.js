
var pinbaSchema = require('../server/pinbaSchema');
var schema = require('./schema.json');

pinbaSchema.config(
    schema.reports.table_prefix,
    schema.reports.percentile1,
    schema.reports.percentile2
);

for (var name in schema.reports.tables) {
    pinbaSchema.createReport(name, schema.reports.tables[name].tags);
}

//TODO execute `create table` queries in mysql
