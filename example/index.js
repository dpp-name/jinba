
var Jinba = require('jinba-js-client');

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
    Jinba.AddUserTimings(jinbaRequest);

    jinbaRequest.startMeasurement('app-init-id', 'app_init');
    // Application.init();
    jinbaRequest.stopMeasurement('app-init-id');
    jinbaRequest.end();
});
