'use strict';

var through = require('through2'),
	fs = require('fs'),
    gutil = require('gulp-util'),
	mapFileFinder = require('./mapFileFinder.js');

var PLUGIN_NAME = 'gulp-subdir-rename';
var pathMapStore = new Map();

function subdirRename(options) {
    if(!options || !options.baseFile || !options.renameTo){
        throw new gutil.PluginError(PLUGIN_NAME, PLUGIN_NAME + ' - Both options `baseFile` and `renameTo` must be given!');
    }


	var stream = function (file, encoding, callback) {
		var self = this;

		var mapFilePath = mapFileFinder.findFullMapFilePath(file, options.baseFile);
		var oldSubDirName = mapFileFinder.findFirstDistinctFolder(file.base, file.path);

		findNewSubPath(mapFilePath, function (err, newSubDirName) {
            if(err){
                self.emit('error', new gutil.PluginError(PLUGIN_NAME, PLUGIN_NAME + ' - Error while reading baseFile: ' + err.message));
            }
			file.path = file.path.replace(oldSubDirName, newSubDirName);

			self.push(file);
			callback();
		});
	};

	function findNewSubPath(mapFilePath, cb) {
		if (pathMapStore.get(mapFilePath)) {
			var newSubDirName = pathMapStore.get(mapFilePath);
			cb(null, newSubDirName);
		} else {
			fs.readFile(mapFilePath, function (err, data) {
                if (err) {
                    return cb(err);
                }

                var newSubPathName = options.renameTo(data);
                pathMapStore.set(mapFilePath, newSubPathName);
                cb(null, newSubPathName);
			});
		}
	}

	return through.obj(stream);
}

module.exports = subdirRename;
