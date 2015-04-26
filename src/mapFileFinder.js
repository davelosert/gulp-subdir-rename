'use strict';

var path = require('path');
module.exports = {
	findFullMapFilePath : function (file, mapFileGlobPath) {
		var firstFolder = this.findFirstDistinctFolder(file.base, file.path);
		return path.join(file.base, firstFolder, mapFileGlobPath);
	},
	findFirstDistinctFolder: function (basePath, fullPath) {
		var relativePath = path.relative(basePath, fullPath);
		return relativePath.split(path.sep)[0];
	}
};