
var JinbaRequest = require('./JinbaRequest');
var JinbaConfig = require('./JinbaConfig');
var MeasureNetworkTiming = require('./MeasureNetworkTiming');
var MeasureAjaxImages = require('./MeasureAjaxImages');
var AddUserTimings = require('./AddUserTimings');

function config(config)
{
    var jinbaConfig = JinbaConfig.getInstance();
    if (config.url) {
        jinbaConfig.setUrl(config.url);
    }
    if (config.batchTimeout) {
        jinbaConfig.setBatchTimeout(config.batchTimeout);
    }
}

module.exports = {
    config: config,
    Request: JinbaRequest,
    MeasureNetworkTiming: MeasureNetworkTiming,
    MeasureAjaxImages: MeasureAjaxImages,
    AddUserTimings: AddUserTimings
};
