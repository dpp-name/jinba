
/**
 * Config
 * @constructor
 */
function JinbaConfig()
{
    this._ua = '';

    this.url = '';
    this.batchTimeout = 1000;
}

JinbaConfig.prototype = {
    /**
     * Set endpoint
     * @param {string} url
     */
    setUrl: function(url)
    {
        this.url = url;
    },
    /**
     * Set batch timeout
     * @param {number} timeout ms
     */
    setBatchTimeout: function(timeout)
    {
        this.batchTimeout = timeout;
    },
    /**
     * Set send transport
     * @param transport
     */
    setTransport: function(transport)
    {
        this.transport = transport;
    },
    /**
     * Get send transport
     * @returns {*}
     */
    getTransport: function()
    {
        return this.transport || require('./JinbaBrowserTransport');
    },
    getUserAgent: function()
    {
        return this._ua || (this._ua = (function ()
            {
                if (typeof process !== 'undefined') {
                    return 'node';
                }
                var _ = eval("/*@cc_on (_=document.createElement('I'),_.innerHTML='<!--[if lte IE 8]>ie8<![endif]--><!--[if IE 9]>ie9<![endif]-->',_.innerText)||(_.innerHTML='ie10',_.innerText) @*/+''");
                return _ || /iphone|ipod|ipad|android|blackberry|symbian|series[6-9]0/i.test(navigator.userAgent) && 'm'
                    || window.opera && 'op'
                    || window.chrome && 'cr'
                    || window.netscape && Object.create && 'ff'
                    || window.WebKitPoint && 'wk'
                    || /a/.__proto__ == '\/\/' && 'wk'
                    || '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style && 'ie11'
                    || '';
            })());
    }
};

/**
 * Get singleton instance
 * @returns {JinbaConfig}
 */
JinbaConfig.getInstance = function()
{
    if (!this._instance) {
        this._instance = new this();
    }
    return this._instance;
};

module.exports = JinbaConfig;
