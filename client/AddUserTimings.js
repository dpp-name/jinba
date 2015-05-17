
function AddUserTimings(jinbaRequest)
{
    var items = window.performance.getEntriesByType('measure');
    for (var i = 0; i < items.length; i++) {
        var req = items[i];
        jinbaRequest.addMeasurement(req.name, Math.round(req.duration));
    }
}

module.exports = AddUserTimings;
