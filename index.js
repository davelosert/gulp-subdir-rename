'use strict';
/**
 * Created by dave on 18.04.15.
 */
var PLUGIN_NAME = 'gulp-subdir-mapper';

var stream = require('./src/stream');

module.exports = function (options) {
	return stream(options);
};