var gulp = require("gulp")
var browserify = require("browserify")
var del = require("del")
var source = require("vinyl-source-stream")
var reactify = require("reactify")

var browserifyOptions = {
  entries: ["./src/index.js"],
  standalone: "Store"
}

gulp.task("clean", function(cb){
  del(["lib/"], cb)
})

gulp.task("lib", ["clean"], function(){
  return browserify(browserifyOptions)
    .transform(reactify, {es6:true})
    .bundle()
    .pipe(source("Store.js"))
    .pipe(gulp.dest("lib/"))
})

gulp.task("default", ["lib"])
