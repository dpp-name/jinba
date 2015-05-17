
/**
 * Measure network timing, call once after initial page load.
 * Call on document ready, before onload.
 * @param {JinbaRequest} jinbaRequest
 * @param [is_wa_frame] TODO remove Badoo dependency
 * @constructor
 */
function MeasureNetworkTiming(jinbaRequest, is_wa_frame)
{
    var t = typeof window !== 'undefined' && window.performance && window.performance.timing;

    if (!t) {
        return;
    }

    var start = t.navigationStart || t.fetchStart;
    if (!start) {
        jinbaRequest.addMeasurement('navtime_error', 0);
        return;
    }

    jinbaRequest.setTimeStart(start);

    // create fake timer to prevent request from ending before onload
    jinbaRequest.startMeasurement('nav-timing', '');

    function onload()
    {
        jinbaRequest.addMeasurement('dns', t.domainLookupEnd - t.domainLookupStart);
        jinbaRequest.addMeasurement('connect', t.connectEnd - t.connectStart);
        jinbaRequest.addMeasurement('wait', t.responseStart - t.connectEnd);
        jinbaRequest.addMeasurement('photo_load', t.loadEventEnd - t.domContentLoadedEventEnd);
        jinbaRequest.addMeasurement('on_load', t.loadEventEnd - start);
        jinbaRequest.addMeasurement('response', t.responseEnd - t.responseStart);
        jinbaRequest.addMeasurement('dom_loading', t.domInteractive - t.responseEnd);
        jinbaRequest.addMeasurement('dom_interactive', t.domContentLoadedEventStart - t.domInteractive);
        jinbaRequest.addMeasurement('dom_loaded', t.domContentLoadedEventEnd - t.domContentLoadedEventStart);
        jinbaRequest.addMeasurement('ttfb', t.responseStart - start);	// time to first byte
        jinbaRequest.addMeasurement('backend', t.responseEnd - start);
        jinbaRequest.addMeasurement('dom_ready', t.domContentLoadedEventStart - start);
        if (!is_wa_frame) {
            jinbaRequest.addMeasurement('usable', t.domContentLoadedEventEnd - start);
        }
        jinbaRequest.deleteMeasurement('nav-timing'); // remove fake timer
    }

    function defer_onload()
    {
        setTimeout(onload, 0);
    }

    if (window.addEventListener) {
        window.addEventListener('load', defer_onload, false);
    } else {
        window.attachEvent('onload', defer_onload);
    }
}

module.exports = MeasureNetworkTiming;
