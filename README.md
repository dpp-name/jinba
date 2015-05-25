# Jinba

This is early release for my talk http://frontendconf.ru/2015/abstracts/1777 we will improve it later :)
Slides from the talk: http://www.slideshare.net/dppsu/jinba-frontendconfru-2015final

Jinba is all about Real User Measurements (RUM) and how to collect/receive/store/visualize RUM data.

Currently we open-source only JavaScript implementation of client https://github.com/dpp-name/jinba-js-client but hopefully will release Android/iOS soon.

In example-badoo folder you can find some scripts that can help you to set up collection/visualization infrastructure.

### Demo

Demo folder contains simple node/webpack devel server with couple of examples. To set up demo use:
```bash
cd demo
npm install
node demo-server.js
```

## Setting up infrastructure

1. Collect data (for web clients use https://github.com/dpp-name/jinba-js-client/)
2. Setup backend endpoint
3. Setup http://pinba.org/
4. See example-badoo/create_schema.js to create pinba reports.
5. Setup http://influxdb.com/
6. See example-badoo/export_pinba2influxdb.js to export data from pinba to influxdb
7. Setup http://grafana.org/
8. See example-badoo/grafanaDashboard.js to create dashboards in grafana
