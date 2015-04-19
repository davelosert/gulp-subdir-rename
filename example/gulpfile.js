'use strict';
/**
 * Created by dave on 19.04.15.
 */


const gulp = require('gulp'),
	through = require('through2'),
	subdirMapper = require('./../index'),
	fs = require('fs');


gulp.task('default', function () {
	gulp.src('./source/**/**.*')
		.pipe(subdirMapper({
			mapFile: 'module.json',
			mapFunc : function (modulePath) {
				let moduleJSONRaw = fs.readFileSync(modulePath);
				let moduleJSON = JSON.parse(moduleJSONRaw);
				return moduleJSON.moduleName;
			}
		}))
		.pipe(gulp.dest('./target'));
});