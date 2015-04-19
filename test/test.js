'use strict';
/**
 * Created by dave on 18.04.15.
 */

const chai = require('chai'),
	sinon = require('sinon'),
	sinonChai = require("sinon-chai"),
	expect = chai.expect;
chai.use(sinonChai);

const Vinyl = require('vinyl'),
	Stream = require('stream').Stream,
	gutil = require('gulp-util'),
	es = require('event-stream');


describe('gulp-subdir-mapper', function () {
	const subdirMapper = require('../index');
	describe('require()', function () {
		it('should return a function', function () {
			expect(subdirMapper).to.be.a('function');
		});
	});
});

describe('stream', function () {
	const stream = require('../src/stream');

	it('should return a function', function () {
		expect(stream).to.be.a('function');
	});

	it('should return a stream in object mode', function () {
		var myStream = stream();
		expect(myStream).to.be.a.instanceOf(Stream);
		expect(myStream._writableState.objectMode).to.be.true;
	});

	it('should return file with same content as put in', function (done) {
		let testFile = new Vinyl({
			contents : new Buffer("This is testcontent!")
		});
		let myStream = stream();
		myStream.write(testFile);
		myStream.once('data', function (file) {
			expect(file.contents.toString()).to.equal("This is testcontent!");
			done();
		});
	});
});

describe('mapFileFinder', function () {
	const mapFileFinder = require('../src/mapFileFinder');

	it('should return a function', function () {
		expect(mapFileFinder).to.be.a('function');
	});

	it('should extract the subdir masked with **', function () {
		let testFile = new Vinyl({
			base : '/path/until/glob',
			path : '/path/until/glob/and/to/file.js'
		});
		let mapPath = 'module.json';
		var subDir = mapFileFinder(testFile, mapPath);
		expect(subDir).to.equal('/path/until/glob/and/module.json');
	});
});