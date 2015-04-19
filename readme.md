gulp-subdir-mapper
===================
Allows you to change subdirectories on a per-file-basis within a globified `gulp.src()` based
on a mapping file.

### Purpose
The need for this plugin arose within a project where we had to pull automatically 
generated modules which were stored under ugly guid-folders and put them into our IDE
to work on them. What we wanted was to have the actual module name as folder name.

*Why dont you use `gulp-rename`*?

One Simple reason: We only know the folders name for a file during execution time,
so we can not use static configuration. Further: The name of the subfolder for a file
is actually stored in a file WITHIN this exact subfolder.


### Usage Example
This:
```
app
|
├── 9ABD4D9D80C702AF85C822A8
|        ├──module1.json
|        └── ... some other files
└── CJF4D4L0D80C702AF85CJFA9
         ├──module2.json
         └── ... some other files and subdirs
```

```
app
|
├── module1
|        ├──module1.json
|        └── ... some other files
└── module2
         ├──module2.json
         └── ... some other files and subdirs
```

```JavaScript
// app/9ABD4D9D80C702AF85C822A8/module.json
{
    "moduleName": "module1",
    "guid" : "9ABD4D9D80C702AF85C822A8"
}

// gulpfile.js
gulp.task('pull', function(){
    gulp.src('./app/**/**.*')
    .pipe(subdirMapper({
                mapFile: './**/module.json',
                mapFunction: function(mapFile){
                    var parsedJSON = JSON.parse(mapFile.contents);
                    return parsedJSON.moduleName;
                }
            }))
    .pipe(gulp.dest('./build/');
});
//
```

... you get this on Task-Execution:
