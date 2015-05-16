
var tpl = require('./tpl');

var percentile1 = '75', percentile2 = '95';

function config(_percentile1, _percentile2)
{
    percentile1 = _percentile1;
    percentile2 = _percentile2;
}

function createReportTable(mysqlClient, tableName, tags)
{
    var table_schema = "CREATE TABLE IF NOT EXISTS `{tableName}` (\n\
{#tag}\
    `{.}` varchar(64) DEFAULT NULL,\n\
{/tag}\n\
	`req_count` int(11) DEFAULT NULL,\n\
	`req_per_sec` float DEFAULT NULL,\n\
	`hit_count` int(11) DEFAULT NULL,\n\
	`hit_per_sec` float DEFAULT NULL,\n\
	`timer_value` float DEFAULT NULL,\n\
	`timer_median` float DEFAULT NULL,\n\
	`ru_utime_value` float DEFAULT NULL,\n\
    `ru_stime_value` float DEFAULT NULL,\n\
	`index_value` varchar(256) DEFAULT NULL,\n\
	`p{percentile1}` float DEFAULT NULL,\n\
	`p{percentile2}` float DEFAULT NULL\n\
) ENGINE=PINBA DEFAULT CHARSET=latin1 \n\
COMMENT='tagN_info:{#tag}{.}{@sep},{/sep}{/tag}::{percentile1},{percentile2}';\n\
";

    return new Promise(function(resolve, reject) {
        var query = tpl(table_schema, {
            tableName: tableName,
            tag: tags,
            percentile1: percentile1,
            percentile2: percentile2
        });

        mysqlClient.query(query, function(err, rows, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(tableName);
        });
    });
}

function createReportHistogram(mysqlClient, tableName, tags)
{
    var table_hv_schema = "CREATE TABLE IF NOT EXISTS `{tableName}_hv` (\n\
    `index_value` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n\
    `segment` int(11) DEFAULT NULL,\n\
    `time_value` float DEFAULT NULL,\n\
    `cnt` int(11) DEFAULT NULL,\n\
    `percent` float DEFAULT NULL,\n\
    KEY `index_value` (`index_value`(85))\n\
) ENGINE=PINBA DEFAULT CHARSET=latin1\n\
COMMENT='hv.tagN_info:{#tag}{.}{@sep},{/sep}{/tag}::{percentile1},{percentile2}';\n\
";

    return new Promise(function(resolve, reject) {
        var query = tpl(table_hv_schema, {
            tableName: tableName,
            tag: tags,
            percentile1: percentile1,
            percentile2: percentile2
        });

        mysqlClient.query(query, function(err, rows, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(tableName);
        });
    });
}

function createReport(mysqlClient, table_prefix, name, tags)
{
    var tableName = name ? table_prefix + '_' + name : table_prefix;
    return Promise.resolve()
        .then(createReportTable.bind(null, mysqlClient, tableName, tags))
        .then(createReportHistogram.bind(null, mysqlClient, tableName, tags));
}

function listReports(mysqlClient, table_prefix)
{
    var show_tables = "SELECT table_name FROM information_schema.Tables WHERE table_schema='pinba' AND table_name LIKE '{table_prefix}%';";

    return new Promise(function(resolve, reject) {
        var query = tpl(show_tables, {
            table_prefix: table_prefix
        });

        mysqlClient.query(query, function(err, rows, fields) {
            if (err) {
                reject(err);
                return;
            }

            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push(rows[i].table_name);
            }

            resolve(result);
        });
    });
}

module.exports = {
    listReports: listReports,
    createReport: createReport,
    config: config
};
