
var tpl = require('./tpl');

var percentile1 = '75', percentile2 = '95';
var table_prefix = '';

var table_schema = "CREATE TABLE `{table_prefix}{name}` (\n\
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

var table_hv_schema = "CREATE TABLE `{table_prefix}{name}_hv` (\n\
    `index_value` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n\
    `segment` int(11) DEFAULT NULL,\n\
    `time_value` float DEFAULT NULL,\n\
    `cnt` int(11) DEFAULT NULL,\n\
    `percent` float DEFAULT NULL,\n\
    KEY `index_value` (`index_value`(85))\n\
) ENGINE=PINBA DEFAULT CHARSET=latin1\n\
COMMENT='hv.tagN_info:{#tag}{.}{@sep},{/sep}{/tag}::{percentile1},{percentile2};\n\
";

function createReportTable(name, tags)
{
	return tpl(table_schema, {
		name: name,
		tag: tags,
		table_prefix: table_prefix,
		percentile1: percentile1,
		percentile2: percentile2
	});
}

function createReportHistogram(name, tags)
{
    return tpl(table_hv_schema, {
        name: name,
        tag: tags,
        table_prefix: table_prefix,
        percentile1: percentile1,
        percentile2: percentile2
    });
}

function createReport(name, tags)
{
    var sql = createReportTable(name, tags);
    console.log(sql);
    sql = createReportHistogram(name, tags);
    console.log(sql);
}

function config(_table_prefix, _percentile1, _percentile2)
{
    table_prefix = _table_prefix;
    percentile1 = _percentile1;
    percentile2 = _percentile2;
}

module.exports = {
    createReport: createReport,
    config: config
};
