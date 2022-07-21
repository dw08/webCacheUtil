const gulp = require("gulp");
const babel = require("gulp-babel");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest("dist"));
});
