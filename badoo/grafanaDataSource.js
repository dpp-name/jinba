/*
 curl 'http://dbh50.mlan:8080/api/datasources' -X PUT -H 'Origin: http://dbh50.mlan:8080'
 -H 'Accept-Encoding: gzip, deflate, sdch'
 -H 'Accept-Language: en-US,en;q=0.8,ru;q=0.6'
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'
 -H 'Content-Type: application/json;charset=UTF-8'
 -H 'Referer: http://dbh50.mlan:8080/datasources/new'
 -H 'Cookie: host=%22dbh50.mlan%22; port=%2210086%22; ssl=false; grafana_sess=637a13e937161f82; grafana_user=admin; grafana_remember=e02f1651f5e6c2585bdf82c1b6cb41b2a215bb564d9dcdd7'
 -H 'Connection: keep-alive'
 --data-binary '{"name":"v2_jinba_ua","type":"influxdb_08","url":"http://dbh50.mlan:10086","access":"proxy","database":"v2_jinba_ua","user":"root","password":"root"}' --compressed

 */

function createDataSource(options)
{
    var dataSource = {
        "name": options.table,
        "type": "influxdb_08",
        "url": options.url,
        "access": "proxy",
        "isDefault": true,
        "database": options.table,
        "user": "root",
        "password": "root"
    };
    return dataSource;
}

var json = createDataSource({
    table: 'v2_jinba_ua',
    url: 'http://dbh50.mlan:10086'
});

console.log(JSON.stringify(json, null, 2));
