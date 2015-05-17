
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
    });
}


var defaultOptions = {
    rowHeight: "250px"
};

function getTimeGraph(schema, options, tags, variables, fixedTagName, fixedTagValue)
{
    var times = ['timer_avg', 'timer_median', 'p' + schema.reports.percentile1, 'p' + schema.reports.percentile2]
    var lines = [];
    for (var i = 0; i < times.length; i++) {
        var seriesName = getInfluxSeriesName(tags, variables, fixedTagName, fixedTagValue) + '.' + times[i];
        lines.push({
            "column": "value",
            "function": "mean",
            "query": 'select mean(value) from "' + seriesName + '" where $timeFilter group by time($interval) order asc',
            "series": seriesName
        })
    }
    return {
        "aliasColors": {},
        "bars": false,
        "datasource": options.table,
        "editable": true,
        "error": false,
        "fill": 1,
        "grid": {
            "leftLogBase": 1,
            "leftMax": null,
            "leftMin": null,
            "rightLogBase": 1,
            "rightMax": null,
            "rightMin": null,
            "threshold1": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2": null,
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
        },
        "id": 1,
        "legend": {
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
        },
        "lines": true,
        "linewidth": 2,
        "links": [],
        "nullPointMode": "connected",
        "percentage": false,
        "pointradius": 5,
        "points": false,
        "renderer": "flot",
        "seriesOverrides": [],
        "span": 6,
        "stack": false,
        "steppedLine": false,
        "targets": lines,
        "timeFrom": null,
        "timeShift": null,
        "title": getInfluxSeriesName(tags, variables, fixedTagName, fixedTagValue) + " TIME",
        "tooltip": {
            "shared": true,
            "value_type": "cumulative"
        },
        "type": "graph",
        "x-axis": true,
        "y-axis": true,
        "y_formats": [
            "short",
            "short"
        ],
        "decimals": 2
    };
}

function getRpsGraph(schema, options, tags, variables, fixedTagName, fixedTagValue)
{
    var seriesName = getInfluxSeriesName(tags, variables, fixedTagName, fixedTagValue) + '.hit_per_sec';
    var line = {
        "column": "value",
        "function": "mean",
        "query": 'select mean(value) from "' + seriesName + '" where $timeFilter group by time($interval) order asc',
        "series": seriesName
    };
    return {
        "aliasColors": {},
        "bars": false,
        "datasource": options.table,
        "editable": true,
        "error": false,
        "fill": 1,
        "grid": {
            "leftLogBase": 1,
            "leftMax": null,
            "leftMin": null,
            "rightLogBase": 1,
            "rightMax": null,
            "rightMin": null,
            "threshold1": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2": null,
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
        },
        "id": 2,
        "legend": {
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
        },
        "lines": true,
        "linewidth": 2,
        "links": [],
        "nullPointMode": "connected",
        "percentage": false,
        "pointradius": 5,
        "points": false,
        "renderer": "flot",
        "seriesOverrides": [],
        "span": 6,
        "stack": false,
        "steppedLine": false,
        "targets": [
            line
        ],
        "timeFrom": null,
        "timeShift": null,
        "title": seriesName + " RPS",
        "tooltip": {
            "shared": true,
            "value_type": "cumulative"
        },
        "type": "graph",
        "x-axis": true,
        "y-axis": true,
        "y_formats": [
            "short",
            "short"
        ],
        "decimals": 2
    };
}

function getInfluxSeriesName(tags, variables, fixedTagName, fixedTagValue)
{
    var name = [];
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        name.push(tag);
        if (variables.indexOf(tag) !== -1) {
            name.push('$' + tag);
        } else if (tag === fixedTagName) {
            name.push(fixedTagValue);
        } else {
            throw new Error('ы?'); //TODO
        }
    }
    return name.join('.');
}

function getInfluxSeriesRegex(tags, variables, fixedTagName, fixedTagValue)
{
    var name = [];
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        name.push(tag);
        if (variables.indexOf(tag) !== -1) {
            name.push('[^.]+');
        } else if (tag === fixedTagName) {
            name.push('([^.]+)');
        } else {
            throw new Error('ы?'); //TODO
        }
    }
    return '/' + name.join('.') + '.*/';
}

function getVariable(options, tagName, tagValues)
{
    var optionValues = [];
    if (tagValues.length === 0) {
        throw new Error("schema.tags[" + tagName + "].values === []");
    }
    for (var i = 0; i < tagValues.length; i++) {
        if (typeof tagValues[i] === 'object') {
            optionValues.push({
                "text": tagValues[i].text,
                "value": tagValues[i].value
            });
        } else {
            optionValues.push({
                "text": tagValues[i],
                "value": tagValues[i]
            });
        }
    }
    return {
        "allFormat": "glob",
        "current": (typeof tagValues[0] === 'object') ? {
            "text": tagValues[0].text,
            "value": tagValues[0].value
        } : {
            "text": tagValues[0],
            "value": tagValues[0]
        },
        "datasource": options.table,
        "includeAll": false,
        "name": tagName,
        "options": optionValues,
        "query": "list series",
        "refresh_on_load": false,
        "regex": getInfluxSeriesRegex(options.tags, options.varTags, tagName),
        "type": "query"
    };
}

function getRow(schema, options, tags, variables, fixedTagName, fixedTagValue)
{
    return {
        "collapse": false,
        "editable": true,
        "height": options.rowHeight,
        "panels": [
            getTimeGraph(schema, options, tags, variables, fixedTagName, fixedTagValue),
            getRpsGraph(schema, options, tags, variables, fixedTagName, fixedTagValue)
        ],
        "title": "Row"
    };
}

function getNavigation(options)
{
    return {
        "collapse": false,
        "enable": true,
        "notice": false,
        "now": true,
        "refresh_intervals": [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
        ],
        "status": "Stable",
        "time_options": [
            "5m",
            "15m",
            "1h",
            "6h",
            "12h",
            "24h",
            "2d",
            "7d",
            "30d"
        ],
        "type": "timepicker"
    };
}

function getDashboard(options)
{
    var dashboardTpl = {
        "id": options.id,
        "title": options.table,
        "originalTitle": options.table,
        "tags": [],
        "style": "dark",
        "timezone": "browser",
        "editable": true,
        "hideControls": false,
        "sharedCrosshair": false,
        "rows": options.rows,
        "nav": [
            getNavigation(options)
        ],
        "time": {
            "from": "now-6h",
            "to": "now"
        },
        "templating": {
            "list": options.variables
        },
        "annotations": {
            "list": []
        },
        "schemaVersion": 6,
        "version": 6
    };
    return {
        dashboard: dashboardTpl,
        overwrite: true
    };
}

function clone(obj)
{
    return JSON.parse(JSON.stringify(obj));
}

function getReportDashboard(schema, name)
{
    var dbName = name ? schema.reports.table_prefix + '_' + name : schema.reports.table_prefix;
    var tags = schema.reports.tables[name].tags;
    var rows_by = schema.reports.tables[name].rows_by;
    var options = clone(defaultOptions);

    options.id = null; //TODO update dashboard
    options.table = dbName;
    options.tags = tags;

    var variables = tags;
    if (rows_by) {
        variables = variables.filter(function(i){ return i !== rows_by });
    }

    if (rows_by) {
        options.rows = [];
        var tag_values = schema.tags[rows_by].values;
        if (tag_values.length === 0) {
            throw new Error("schema.tags[rows_by].values === []");
        }

        for (var i = 0; i < tag_values.length; i++) {
            options.rows.push(getRow(schema, options, tags, variables, rows_by, tag_values[i]));
        }
    }

    if (variables.length) {
        options.varTags = tags;
        options.variables = [];
        for (var i = 0; i < variables.length; i++) {
            options.variables.push(getVariable(options, variables[i], schema.tags[variables[i]].values));
        }
    }

    return getDashboard(options);
}

function createReportDashboard(url, grafanaKey, schema, name)
{
    var json = getReportDashboard(schema, name);

    return new Promise(function(resolve, reject) {
        request({
            url: 'http://dbh50.mlan:8080/api/dashboards/db',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + grafanaKey
            },
            body: JSON.stringify(json)
        }, function(err, response, body) {
            if (err || response.statusCode !== 200) {
                reject(err || (response.statusCode + ' ' + body));
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    authorizeWebApi: authorizeWebApi,
    createDataSource: createDataSource,
    createReportDashboard: createReportDashboard
};
