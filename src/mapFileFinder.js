'use strict';

const path = require('path');
module.exports = function (file, mapPath) {
	let relativePath = path.relative(file.base, file.path);
	let firstFolder = relativePath.split(path.sep)[0];

	return path.join(file.base, firstFolder, mapPath);
};