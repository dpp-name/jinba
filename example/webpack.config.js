var path = require('path');
var webpack = require('webpack');

module.exports = {
	debug: true,
	devtool: 'source-map',
	watch: true,
	resolve: {
		root: process.cwd()
	},
	entry: {
        index: './index',
        'ajax-example': './ajax-example'
    },
	output: {
		pathinfo: true,
		path: path.join(process.cwd(), 'build/'),
		publicPath: '/build/',
		filename: '[name].js',
		chunkFilename: '[name].js'
	}
};

