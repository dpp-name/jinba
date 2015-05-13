
var schema = require('./schema.json');

var mysql = require('mysql');

var mysqlClient = mysql.createConnection({
    host     : 'pinbajs.mlan',
    user     : 'pinba',
    password : 'pinbapass7',
    database : 'pinba'
});

function getCountryNames()
{
    return new Promise(function(resolve, reject) {
        var query = "select country_id,name from CountryNames where lang_id=3";

        mysqlClient.query(query, function(err, rows, fields) {
            if (err) {
                reject(err);
                return;
            }

            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    value: rows[i].country_id,
                    text: rows[i].name
                });
            }

            resolve(result);
        });
    });
}

function getScriptNames()
{
    return new Promise(function(resolve, reject) {
        //TODO for history we should store script names elsewhere.
        var query = "select distinct script from v2_jinba_script";

        mysqlClient.query(query, function(err, rows, fields) {
            if (err) {
                reject(err);
                return;
            }

            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push(rows[i].script);
            }

            resolve(result);
        });
    });
}

function getSchema()
{
    return Promise.resolve()
        .then(getCountryNames)
        .then(function(countryNames) {
            schema.tags.country.values = countryNames;
        })
        .then(getScriptNames)
        .then(function(scriptNames) {
            schema.tags.script.values = scriptNames;
        }).then(function(){
            mysqlClient.end();
            return schema;
        });
}

module.exports = {
    getSchema: getSchema,
    getCountryNames: getCountryNames,
    getScriptNames: getScriptNames
};
