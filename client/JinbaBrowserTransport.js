/**
 * Send data from browser
 * @param url
 * @param data
 */
function sendData(url, data)
{
    if (!window || !window.JSON || !window.XMLHttpRequest) {
        console.log('JinbaBrowserTransport is unavaliable, !window || !window.JSON || !window.XMLHttpRequest === true');
        return;
    }
    if (!url) {
        console.log('JinbaBrowserTransport url is empty');
        return;
    }

    var data_str = JSON.stringify(data);

    if (typeof navigator === 'undefined' || !navigator.sendBeacon || !navigator.sendBeacon(url, data_str)) {
        var t = new XMLHttpRequest();
        t.open('POST', url, true);
        t.send(data_str);
    }

    if (DEBUG) {
        console.log('Jinba: send ' + data.length + ' requests');
    }
}

module.exports = sendData;
