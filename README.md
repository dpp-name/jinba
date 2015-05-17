# Jinba

This is early release for my talk http://frontendconf.ru/2015/abstracts/1777 we will improve it later :)

Jinba is simple micro-library which helps to collect and send different performance measurements.
Currently we open-source only JavaScript implementation of client but hopefully will release Android/iOS soon.

Jinba is all about Real User Measurements (RUM) and how to collect/receive/store/visualize RUM data.

In example-badoo folder you can find some scripts that can help you to set up collection/visualization infrastructure.


## JavaScript Client

### API

http://dpp-name.github.io/jinba/

### Build JavaScript Client

Jinba JavaScript client is written using CommonJS module format. You can use it directily in nodejs or use webpack to build for browser.

    webpack -p --output-library="Jinba" --output-library-target="var" js-client/Jinba.js dist/Jinba.Client.min.js

### Usage example
```html
<script src="Jinba.Client.min.js"></script>
<script>
    Jinba.config({
        url:'/jinba/',
        batchTimeout: 1000
    });
    var TAG_WEBSITE = {
        app_label: 'example'
    };
    window.addEventListener('DOMContentLoaded', function() {
        var jinbaRequest = new Jinba.Request(location.pathname, TAG_WEBSITE);
        Jinba.MeasureNetworkTiming(jinbaRequest);

        jinbaRequest.startMeasurement('app-init-id', 'app_init');
        // Application.init();
        jinbaRequest.stopMeasurement('app-init-id');
        jinbaRequest.end();
    });
</script>
```


## Setting up infrastructure

1. Collect data
2. Setup backend endpoint
3. Setup http://pinba.org/
4. See example-badoo/create_schema.js to create pinba reports.
5. Setup http://influxdb.com/
6. See example-badoo/export_pinba2influxdb.js to export data from pinba to influxdb
7. Setup http://grafana.org/
8. See example-badoo/grafanaDashboard.js to create dashboards in grafana