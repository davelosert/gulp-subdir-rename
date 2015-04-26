'use strict';

const through = require('through2'),
	fs = require('fs'),
	mapFileFinder = require('./mapFileFinder.js');


const pathMapStore = new Map();

module.exports = function (options) {
	let stream = function (file, encoding, callback) {
		let self = this;

		let mapFilePath = mapFileFinder.findFullMapFilePath(file, options.mapFile);
		let oldSubPathName = mapFileFinder.findFirstDistinctFolder(file.base, file.path);

		findNewSubPath(mapFilePath, function (err, newSubPathName) {
			file.path = file.path.replace(oldSubPathName, newSubPathName);

			self.push(file);
			callback();
		});
	};

	function findNewSubPath(mapFilePath, cb) {
		if (pathMapStore.get(mapFilePath)) {
			let newSubPathName = pathMapStore.get(mapFilePath);
			cb(null, newSubPathName);
		} else {
			fs.readFile(mapFilePath, function (err, data) {
				let newSubPathName = options.mapFunc(data);
				pathMapStore.set(mapFilePath, newSubPathName);
				cb(null, newSubPathName);
			});
		}
	}

	return through.obj(stream);
};

