
var JinbaConfig = require('./JinbaConfig');

/**
 * SendPool batches requests send to backend.
 * @constructor
 */
function JinbaSendPool()
{
    this._pool = [];
    this._timer = 0;
    this._send = this.send.bind(this);
}

JinbaSendPool.prototype = {
    /**
     * Add request to pool.
     * @param {JinbaRequest} obj
     */
    push: function (obj)
    {
        this._pool.push(obj);

        if (!this._timer) {
            this._timer = setTimeout(this._send, JinbaConfig.getInstance().batchTimeout);
        }
    },
    /**
     * Aborts pending requests.
     */
    abort: function()
    {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = 0;
        }
        this._pool = [];
    },
    /**
     * @returns {Array}
     * @private
     */
    _getData: function ()
    {
        var data = [];
        for (var i = 0, n = this._pool.length; i < n; i++) {
            data[i] = this._pool[i].toJSON();
        }
        this._pool = [];
        return data;
    },
    /**
     * Send batched requests over the wire.
     */
    send: function ()
    {
        this._timer = 0;

        var url = JinbaConfig.getInstance().url;
        var data = this._getData();
        var transport = JinbaConfig.getInstance().getTransport();

        transport(url, data);
    }
};

/**
 * Get singleton instance
 * @returns {JinbaSendPool}
 */
JinbaSendPool.getInstance = function()
{
    if (!this._instance) {
        this._instance = new this();
    }
    return this._instance;
};

module.exports = JinbaSendPool;
