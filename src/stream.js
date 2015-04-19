'use strict';

const through = require('through2'),
	mapFileFinder = require('./mapFileFinder.js');

module.exports = function (options) {
	return through.obj(function (file, encoding, callback) {
		let mapFilePath = mapFileFinder.findFullMapFilePath(file, options.mapFile);
		let oldSubPathName = mapFileFinder.findFirstDistinctFolder(file.base, file.path);
		let newSubPathName = options.mapFunc(mapFilePath);
		file.path = file.path.replace(oldSubPathName, newSubPathName);

		this.push(file);
		callback();
	});
};

