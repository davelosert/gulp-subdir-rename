'use strict';

var through = require('through2'),
	fs = require('fs'),
	mapFileFinder = require('./mapFileFinder.js');


var pathMapStore = new Map();

module.exports = function (options) {
	var stream = function (file, encoding, callback) {
		var self = this;

		var mapFilePath = mapFileFinder.findFullMapFilePath(file, options.baseFile);
		var oldSubPathName = mapFileFinder.findFirstDistinctFolder(file.base, file.path);

		findNewSubPath(mapFilePath, function (err, newSubPathName) {
			file.path = file.path.replace(oldSubPathName, newSubPathName);

			self.push(file);
			callback();
		});
	};

	function findNewSubPath(mapFilePath, cb) {
		if (pathMapStore.get(mapFilePath)) {
			var newSubPathName = pathMapStore.get(mapFilePath);
			cb(null, newSubPathName);
		} else {
			fs.readFile(mapFilePath, function (err, data) {
				var newSubPathName = options.renameTo(data);
				pathMapStore.set(mapFilePath, newSubPathName);
				cb(null, newSubPathName);
			});
		}
	}

	return through.obj(stream);
};

