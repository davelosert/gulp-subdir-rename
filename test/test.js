'use strict';
/**
 * Created by dave on 18.04.15.
 */

const chai = require('chai'),
	sinon = require('sinon'),
	sinonChai = require("sinon-chai"),
	proxyquire = require('proxyquire').noPreserveCache(),
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
	let stream,
		options,
		myStream,
		testFile,
		mapFileFinderStub;

	beforeEach(function setUp() {
		mapFileFinderStub = {
			findFullMapFilePath : sinon.stub().returns('/stub/path/module.json'),
			findFirstDistinctFolder : sinon.stub().returns('pathToBeReplaced')
		};
		stream = proxyquire('../src/stream', {
			'./mapFileFinder.js' : mapFileFinderStub
		});

		options = {
			mapFile : 'module.json',
			mapFunc : sinon.stub().returns('replacementSubPath')
		};

		myStream = stream(options);

		testFile =  new Vinyl({
			base : '/stub/path',
			path : '/stub/path/pathToBeReplaced/testFile.js',
			contents : new Buffer("This is testcontent!")
		});

	});

	it('should return a function', function () {
		expect(stream).to.be.a('function');
	});

	it('should return a stream in object mode', function () {
		expect(myStream).to.be.a.instanceOf(Stream);
		expect(myStream._writableState.objectMode).to.be.true;
	});

	it('should return file with same content as put in', function (done) {
		myStream.write(testFile);
		myStream.once('data', function (file) {
			expect(file.contents.toString()).to.equal("This is testcontent!");
			done();
		});
	});

	it('should call mapFileFinder to get mapFilePath', function () {
		myStream.write(testFile);
		expect(mapFileFinderStub.findFullMapFilePath).to.have.been.called;
	});

	it('should call mapFileFinder with "file" and "mapFile" from options', function () {
		myStream.write(testFile);
		expect(mapFileFinderStub.findFullMapFilePath).to.have.been.calledWith(testFile, options.mapFile);
	});

	it('should call options.mapFunc', function () {
		myStream.write(testFile);
		expect(options.mapFunc).to.have.been.called;
	});

	it('should call options.mapFunc with results of mapFileFinder', function () {
		myStream.write(testFile);
		expect(options.mapFunc).to.have.been.calledWith('/stub/path/module.json');
	});

	it('should call mapFileFinder to find first distinct folder', function () {
		myStream.write(testFile);
		expect(mapFileFinderStub.findFirstDistinctFolder).to.have.been.called;
	});

	it('should call mapFileFinder with files base and path', function () {
		myStream.write(testFile);
		expect(mapFileFinderStub.findFirstDistinctFolder).to.have.been.calledWith('/stub/path', '/stub/path/pathToBeReplaced/testFile.js');
	});

	it('should modify files sub-path', function () {
		myStream.write(testFile);
		expect(testFile.path).to.equal('/stub/path/replacementSubPath/testFile.js')
	});
});

describe('mapFileFinder', function () {
	const mapFileFinder = require('../src/mapFileFinder');

	it('should return a object', function () {
		expect(mapFileFinder).to.be.a('object');
	});

	describe('#findFullMapFilePath()', function () {
		it('should exist', function () {
			expect(mapFileFinder.findFullMapFilePath).to.exist;
			expect(mapFileFinder.findFullMapFilePath).to.be.a('function');
		});

		it('should extract the subdir masked with **', function () {
			let testFile = new Vinyl({
				base : '/path/until/glob',
				path : '/path/until/glob/and/to/file.js'
			});
			let mapPath = 'module.json';
			var subDir = mapFileFinder.findFullMapFilePath(testFile, mapPath);
			expect(subDir).to.equal('/path/until/glob/and/module.json');
		});
	});

	describe('#findFirstDistinctFolder()', function () {
		it('should exist', function () {
			expect(mapFileFinder.findFirstDistinctFolder).to.exist;
			expect(mapFileFinder.findFirstDistinctFolder).to.be.a('function');
		});

		it('should return the first distinct folder', function () {
			let basePath = '/path/to/a/folder';
			let fullPath = '/path/to/a/folder/with/a/file';
			let result = mapFileFinder.findFirstDistinctFolder(basePath, fullPath);
			expect(result).to.equal('with');
		});
	});
});