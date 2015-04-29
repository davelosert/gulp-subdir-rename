'use strict';
/**
 * Created by dave on 19.04.15.
 */


var gulp = require('gulp'),
	subdirRename = require('./../index');


gulp.task('default', function () {
	gulp.src('./source/**/**.*')
		.pipe(subdirRename({
			baseFile : './module.json',
			renameTo : function (baseFileData) {
				var moduleJSON = JSON.parse(baseFileData);
				return moduleJSON.moduleName;
			}
		}))
		.pipe(gulp.dest('./target'));
});