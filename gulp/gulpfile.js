const gulp  = require('gulp');
const mkdir = require('mk-dirs');
const touch = require('write');
const del   = require('del');

const sass = require('gulp-sass');
const cached = require('gulp-cached');
const watch = require('gulp-watch');

const browserSync = require('browser-sync');
// .create()


// base dir setting
const dir = {base:'./public/', before:'./public/src/', after:'./public/dist/'};



gulp.task('test', function(){
  console.log("gulp setting test________________________");
});



// folder생성 ________________________________________________
gulp.task('makeFolder', function(){
Promise.all([
  // mkdir.('./public/') 굳이 만들지 않아도 생김
  mkdir(dir.before),
  mkdir(dir.after)
  ]);
});

// 파일생성  ________________________________________________
gulp.task('touchFile', function(){
  // .gitignore설정
    touch.sync('./.gitignore','node_modules/ \n **/*.ai \n **/*.psd');
    //redeme.md
    touch.sync(dir.base + '/REDEME.md','#작업파일 설정 \n  .....');
    // scss파일설정
    touch.sync(dir.before + 'scss/base/reset.scss');
    touch.sync(dir.before + 'scss/base/common.scss');
    touch.sync(dir.before + 'scss/base/_variable.scss');
    touch.sync(dir.before + 'scss/base/_mixin.scss');
});





// browser-sync로 확인을 편하게__________________________________ 
gulp.task('browserSync',['sassCompile'], function(){
  browserSync.init({
    server: {
      baseDir: dir.after //dist 경로값 
    }
  });
});


// sass/scss -> css로 변환__________________________________
gulp.task('sassCompile', function(){
  gulp.src(dir.before + 'scss/**/*.scss')
      .pipe(cached('sassFiles'))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(dir.after+'css'))
      .pipe(browserSync.stream());
});

// sass/scss변환시 자동으로 바꿔줌__________________________________
gulp.task('sassWatch', function(){
  watch(dir.before + 'scss/**/*.scss', function(){gulp.start('sassCompile')});
});




// 코드에러나 기타등등 표기를 다르게


// 폴더 및 파일 삭제_______________________________________

gulp.task('delCss', function(){
  del([dir.after+'css'], {force:true});
});

gulp.task('delDist', function(){
  del([dir.after,'!dist'], {force:true});
});




gulp.task('set', ['makeFolder', 'touchFile']);
gulp.task('default', ['sassCompile','sassWatch', 'browserSync']);



