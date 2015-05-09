
/**
 * Jinba Measurement
 * @param {string} name
 * @param {Object} tags
 * @param {number} value
 * @constructor
 */
function JinbaMeasurement(name, tags, value)
{
    this.time_start = value ? 0 : +new Date;
    this.time_end = 0;
    this.name = name;
    this.tags = tags || null;
    this.value = value || 0;
}

JinbaMeasurement.prototype = {
    /**
     * Stop measurement
     */
    stop: function ()
    {
        if (this.time_end || !this.time_start) {
            return;
        }
        this.time_end = +new Date;
        this.value = this.time_end - this.time_start;
    },
    /**
     * Is measurement active
     * @returns {boolean}
     */
    isActive: function()
    {
        return !this.time_end && this.time_start;
    },
    /**
     * Serialize to JSON
     * @returns {Object}
     */
    toJSON: function ()
    {
        var json = {
            name: this.name,
            value: this.value
        };

        if (this.tags) {
            json.tags = this.tags;
        }

        return json;
    }
};

module.exports = JinbaMeasurement;
