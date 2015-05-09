
var dust = require('dustjs-linkedin');
var dustHelpers = require('dustjs-helpers');

dust.config.whitespace = true;

function tpl(tpl, data)
{
	var compiledTemplate = dust.compile(tpl, tpl);
	dust.loadSource(compiledTemplate);
	var output = '';
	dust.render(tpl, data, function(err, str) {
		if (err) {
			throw err;
		}
		output = str;
	});
	return output;
}

module.exports = tpl;

