'use strict';
/**
 * Created by dave on 19.04.15.
 */


var gulp = require('gulp'),
	through = require('through2'),
	subdirMapper = require('./../index'),
	fs = require('fs');


gulp.task('default', function () {
	gulp.src('./source/**/**.*')
		.pipe(subdirMapper({
			baseFile : 'module.json',
			renameTo : function (baseFileData) {
				var moduleJSON = JSON.parse(baseFileData);
				return moduleJSON.moduleName;
			}
		}))
		.pipe(gulp.dest('./target'));
});