'use strict';

const path = require('path');
module.exports = {
	findFullMapFilePath : function (file, mapFileGlobPath) {
		let firstFolder = this.findFirstDistinctFolder(file.base, file.path);
		return path.join(file.base, firstFolder, mapFileGlobPath);
	},
	findFirstDistinctFolder: function (basePath, fullPath) {
		let relativePath = path.relative(basePath, fullPath);
		return relativePath.split(path.sep)[0];
	}
};