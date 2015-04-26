gulp-subdir-rename
===================
Dynamically rename subdirectories of a glob on a per-file-basis by using base-files within the subdirectories.

### Purpose
The need for this plugin arose within a project where we had to pull automatically 
generated modules, which were stored under ugly guid-named folders, and put them into our IDE. 
What we wanted was to have the actual modules name as folder name.

*Why don't you use `gulp-rename`*?

One Simple reason: We only know the folders name for a file during execution time,
so we can not use static configuration. And also, the name of the subfolder for a file
is actually stored in a file WITHIN this exact subfolder. You could achieve this with a rather complex function
given to `gulp-rename()` - but this is bascially what this plugin does for you.


### Example
Suppose you have several modules in a folder structure like this:
```
app
|
├── 9ABD4D9D80C702AF85C822A8
|        ├── module.json
|        └── ... some other files
└── CJF4D4L0D80C702AF85CJFA9
         ├──module.json
         └── ... some other files and subdirs
```

The modules folders are weird GUIDs, the modules names are actually stored within each `module.json`.
What you actually want is this:

```
app
|
├── module1
|        ├──module.json
|        └── ... some other files
└── module2
         ├──module.json
         └── ... some other files and subdirs
```

With `gulp-subdir-rename`, it is as easy as this:
```JavaScript
// gulpfile.js
gulp.task('pull', function(){
    gulp.src('./app/**/**.*')
    .pipe(subdirMapper({
                baseFile: './module.json',
                renameTo: function(baseFileData){
                    var parsedJSON = JSON.parse(baseFileData);
                    return parsedJSON.moduleName;
                }
            }))
    .pipe(gulp.dest('./build/');
});
```

### Usage
`gulp-subdir-rename` renames the first subfolder after the base-path of your `gulp-src` (the base path is usually where
the glob starts, so for example for `base/path/**` it would be `/base/path`). 

`gulp-subdir-rename` returns a function that accepts an options-object with two parameters:

* **baseFile** - *string* : The relative path to the file you wanna pull the subdirectories name from. Its full path will be used as a parameter
for the *renameTo*-Function. The path to the `baseFile` must be relative to the subfolder to be renamed.
* **renameTo** - *function(baseFile)* : The functions return value will be used as the new subdirectories name. As a parameter, it recieves the full path to the *baseFile* specified above.