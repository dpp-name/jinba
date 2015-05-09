// Measure images load time after page have been refreshed with some innerHTML's
// TODO add IE support, see https://github.com/desandro/imagesloaded/

var JinbaConfig = require('./JinbaConfig');

function filter_loaded(a)
{
    var b = [];
    for (var i = 0, n = a.length; i < n; i++) {
        if (!a[i].complete && a[i].fileSize != '-1') {
            b[b.length] = a[i];
        }
    }
    return b;
}

var timer = 0, previousJinbaRequest;

function MeasureAjaxImages(jinbaRequest)
{
    if (timer) {
        clearTimeout(timer);
        timer = 0;
        previousJinbaRequest.stopMeasurement('load_img');
    }

    previousJinbaRequest = jinbaRequest;
    jinbaRequest.startMeasurement('load_img', 'load_img');
    if (DEBUG) {
        var start = +new Date;
    }
    var imgs = document.images;

    function test()
    {
        imgs = filter_loaded(imgs);
        if (DEBUG) {
            console.log(imgs.length, imgs);
        }
        if (imgs.length) {
            timer = setTimeout(test, 50);
        } else {
            jinbaRequest.stopMeasurement('load_img');
            previousJinbaRequest = timer = 0;
            if (DEBUG) {
                console.log('ajax_images: ' + (+new Date - start));
            }
        }
        return imgs.length;
    }

    test();
}

var ua = JinbaConfig.getInstance().getUserAgent();
if (ua === 'ie8' || ua === 'ie9' || ua === 'ie10') {
    // IE8-10 does not support this method of image loading detection and goes into infinity loop.
    module.exports = function(){};
} else {
    module.exports = MeasureAjaxImages;
}
