
require('./polyfills');

var Jinba = require('jinba-js-client');

Jinba.config({
    url:'/jinba/',
    batchTimeout: 1000
});

var TAG_WEBSITE = {
    app_label: 'example'
};

var Application = {
    init: function()
    {
        document.addEventListener('click', function(e) {
            var target = e.target || e.srcElement;
            if (target.matches('.app')) {
                Application.changePage(target);
                event.preventDefault();
            }
        });
    },
    changePage: function(element)
    {
        var jinbaRequest = new Jinba.Request(element.pathname, TAG_WEBSITE);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState < 4) {
                return;
            }
            if (xhr.status !== 200) {
                jinbaRequest.end(Jinba.Request.ERROR_STATUS_FAIL);
                document.getElementById('container').innerHTML = 'Oops...';
                return;
            }
            document.getElementById('container').innerHTML = xhr.responseText;
            jinbaRequest.end();
        };
        xhr.open('GET', element.href, true);
        xhr.send();
    }
};

window.addEventListener('DOMContentLoaded', function() {
    var jinbaRequest = new Jinba.Request(location.pathname, TAG_WEBSITE);
    Jinba.MeasureNetworkTiming(jinbaRequest);

    jinbaRequest.startMeasurement('app-init-id', 'app_init');
    Application.init();
    jinbaRequest.stopMeasurement('app-init-id');
    jinbaRequest.end();
});
