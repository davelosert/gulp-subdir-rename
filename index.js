'use strict';
/**
 * Created by dave on 18.04.15.
 */
const PLUGIN_NAME = 'gulp-subdir-mapper';

const stream = require('./src/stream');

module.exports = function (options) {
	return stream(options);
};