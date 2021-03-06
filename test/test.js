'use strict';
/**
 * Created by dave on 18.04.15.
 */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai"),
    proxyquire = require('proxyquire').noPreserveCache(),
    expect = chai.expect;
chai.use(sinonChai);

var Vinyl = require('vinyl'),
    Stream = require('stream').Stream;

describe('gulp-subdir-mapper', function () {
    var subdirMapper = require('../index');
    describe('require()', function () {
        it('should return a function', function () {
            expect(subdirMapper).to.be.a('function');
        });
        it('should throw if options missing', function () {
            var funcWrapper = function () {
                subdirMapper();
            };
            expect(funcWrapper).to.throw('Both options `baseFile` and `renameTo` must be given!');
        });
    });
});

describe('stream', function () {
    var stream,
        options,
        myStream,
        testFile,
        mapFileFinderStub;

    beforeEach(function setUp() {
        mapFileFinderStub = {
            findFullMapFilePath : sinon.stub().returns('/stub/path/module.json'),
            findFirstDistinctFolder : sinon.stub().returns('pathToBeReplaced')
        };
        var fsStub = {
            readFile : sinon.stub().yields(null, 'This is testcontent!')
        };

        stream = proxyquire('../src/stream', {
            './mapFileFinder.js' : mapFileFinderStub,
            'fs' : fsStub
        });

        options = {
            baseFile : 'module.json',
            renameTo : sinon.stub().returns('replacementSubPath')
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

    it('should call mapFileFinder with "file" and "baseFile" from options', function () {
        myStream.write(testFile);
        expect(mapFileFinderStub.findFullMapFilePath).to.have.been.calledWith(testFile, options.baseFile);
    });

    it('should call options.renameTo with the contents of the mapfile', function () {
        myStream.write(testFile);
        expect(options.renameTo).to.have.been.calledWith('This is testcontent!');
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

    it('should store already found subpath', function () {
        var testFile2 =  new Vinyl({
            base : '/stub/path',
            path : '/stub/path/pathToBeReplaced/testFile2.js',
            contents : new Buffer("This is testcontent!")
        });
        myStream.write(testFile);
        myStream.write(testFile2);
        expect(options.renameTo).to.have.callCount(1);
        expect(testFile2.path).to.equal('/stub/path/replacementSubPath/testFile2.js')
    });

    it('should throw if fs throws', function () {
        var fsStub = {
            readFile : sinon.stub().yields(new Error('File not found!'))
        };

        stream = proxyquire('../src/stream', {
            './mapFileFinder.js' : mapFileFinderStub,
            'fs' : fsStub
        });
        myStream = stream(options);
        var funcWrapper = function () {
            myStream.write(testFile);
        };
        expect(funcWrapper).to.throw('gulp-subdir-rename - Error while reading baseFile: File not found!');
    });

    describe('stream with optional flag', function() {
        beforeEach(function() {
            var fsStub = {
                readFile: sinon.stub().yields(new Error('File not found!'))
            };
            stream = proxyquire('../src/stream', {
                './mapFileFinder.js': mapFileFinderStub,
                'fs': fsStub
            });
            myStream = stream(options);
        });

        it('should not throw if fs throws but isOptional option is true', function () {
            options.isOptional = true;
            var funcWrapper = function () {
                myStream.write(testFile);
            };
            expect(funcWrapper).to.not.throw('gulp-subdir-rename - Error while reading baseFile: File not found!');
        });

        it('should throw if fs throws but isOptional option is false', function () {
            options.isOptional = false;
            var funcWrapper = function () {
                myStream.write(testFile);
            };
            expect(funcWrapper).to.throw('gulp-subdir-rename - Error while reading baseFile: File not found!');
        });
    });
});

describe('mapFileFinder', function () {
    var mapFileFinder = require('../src/mapFileFinder');

    it('should return a object', function () {
        expect(mapFileFinder).to.be.a('object');
    });

    describe('#findFullMapFilePath()', function () {
        it('should exist', function () {
            expect(mapFileFinder.findFullMapFilePath).to.exist;
            expect(mapFileFinder.findFullMapFilePath).to.be.a('function');
        });

        it('should extract the subdir masked with **', function () {
            var testFile = new Vinyl({
                base : '/path/until/glob',
                path : '/path/until/glob/and/to/file.js'
            });
            var mapPath = 'module.json';
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
            var basePath = '/path/to/a/folder';
            var fullPath = '/path/to/a/folder/with/a/file';
            var result = mapFileFinder.findFirstDistinctFolder(basePath, fullPath);
            expect(result).to.equal('with');
        });
    });
});