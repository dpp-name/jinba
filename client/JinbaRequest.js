
var JinbaSendPool = require('./JinbaSendPool');
var JinbaMeasurement = require('./JinbaMeasurement');

/**
 * Create Jinba Request to measure screens (pages, scripts, whatever you call it)
 * @param {string} name
 * @param {Object} tags
 * @constructor
 */
function JinbaRequest(name, tags)
{
    if (DEBUG) {
        console.info('JinbaRequest', name, tags);
        if (window.$d) {
            $d.trace(this, 'JinbaRequest', null, 'localtime');
        }
    }

    this.time_start = +new Date;
    this.time_end = 0;
    this.name = name;
    this.tags = tags || {};
    this.value = 0;
    this.measurements = [];
    this.measurements_active = 0;
    this._tmap = {};

    this.status = JinbaRequest.ACTIVE;
}

JinbaRequest.ACTIVE = 0;
JinbaRequest.ABORTED = 1;
JinbaRequest.ENDED = 2;
JinbaRequest.SENDED = 3;

JinbaRequest.ERROR_STATUS_OK = 0;
JinbaRequest.ERROR_STATUS_FAIL = 1;

JinbaRequest.prototype = {
    /**
     * Set request name
     * @param {string} name
     */
    setName: function(name)
    {
        this.name = name;
    },
    /**
     * Set request start time
     * @param {number} time_start
     */
    setTimeStart: function (time_start)
    {
        this.time_start = time_start;
    },
    /**
     * Set request tag
     * @param {string} key
     * @param {number} value
     */
    setTag: function (key, value)
    {
        this.tags[key] = value;
    },
    /**
     * Returns true if request is not aborted or sended.
     * @returns {boolean}
     */
    isActive: function ()
    {
        return this.status === JinbaRequest.ACTIVE;
    },
    /**
     * Abort stopping all measurements
     */
    abort: function ()
    {
        for (var i = 0, n = this.measurements.length; i < n; i++) {
            this.measurements[i].stop();
        }
        this.measurements_active = 0;

        this.status = JinbaRequest.ABORTED;
    },
    /**
     * End request, data will be send automatically when all measurements that belong to this request will stop.
     * @param {number} [errorStatus]
     */
    end: function (errorStatus)
    {
        if (this.status !== JinbaRequest.ACTIVE) {
            return;
        }

        this.status = JinbaRequest.ENDED;

        if (arguments.length === 0) {
            errorStatus = JinbaRequest.ERROR_STATUS_OK;
        }

        this.tags.errorStatus = errorStatus;

        this._end();
    },
    /**
     * @private
     */
    _end: function()
    {
        if (this.status !== JinbaRequest.ENDED || this.measurements_active) {
            return;
        }

        this.time_end = +new Date;
        this.value = this.time_end - this.time_start;

        this._send();
    },
    /**
     * Send request data through send-pool
     * @private
     */
    _send: function ()
    {
        if (DEBUG) {
            console.log('JinbaRequest.send', this.toJSON());
        }

        JinbaSendPool.getInstance().push(this);

        this.status = JinbaRequest.SENDED;
    },
    /**
     * Add measurement to request
     * @param {string} name measurement name
     * @param {number} value time, ms
     * @param {Object} [tags] measurement tags
     */
    addMeasurement: function (name, value, tags)
    {
        var measurement = new JinbaMeasurement(name, tags, value);
        this.measurements.push(measurement);
    },
    /**
     * Start measurement
     * @param {string} id unique measurement id
     * @param {string} name
     * @param {Object} [tags] measurement tags
     */
    startMeasurement: function (id, name, tags)
    {
        if (DEBUG) {
            if (id in this._tmap) {
                console.error('JinbaRequest: duplicate measurement id ', id) && console.trace();
            }
        }

        var measurement = new JinbaMeasurement(name, tags);
        this.measurements.push(measurement);
        this._tmap[id] = measurement;
        this.measurements_active++;
    },
    /**
     * Stop measurement
     * @param {string} id unique measurement id
     */
    stopMeasurement: function (id)
    {
        var measurement = this._tmap[id];
        if (!measurement) {
            if (DEBUG) {
                console.error('JinbaRequest: absent measurement', id) && console.trace();
            }
            return;
        }

        measurement.stop();
        this.measurements_active--;

        this._end();
    },
    /**
     * Delete measurement
     * @param {string} id
     * @returns {boolean}
     */
    deleteMeasurement: function (id)
    {
        var measurement = this._tmap[id];
        if (!measurement) {
            if (DEBUG) {
                console.error('JinbaRequest: absent measurement', id) && console.trace();
            }
            return false;
        }

        delete this._tmap[id];

        if (measurement.isActive()) {
            this.measurements_active--;
        }

        for (var i = 0, n = this.measurements.length; i < n; i++) {
            if (measurement === this.measurements[i]) {
                this.measurements.splice(i, 1);
            }
        }

        this._end();
    },
    /**
     * Serialize request to JSON
     * @returns {Object}
     */
    toJSON: function ()
    {
        var measurements = [];
        for (var i = 0, n = this.measurements.length; i < n; i++) {
            measurements.push(this.measurements[i].toJSON());
        }

        return {
            name: this.name,
            value: this.value,
            tags: this.tags,
            measurements: measurements
        };
    }
};

module.exports = JinbaRequest;
