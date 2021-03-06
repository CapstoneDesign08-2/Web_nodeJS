﻿//https://github.com/CapstoneDesign08/Web_nodeJS.git
//module
var express = require('express'); 
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var process = require('child_process');
var webeEngine = require('consolidate');

//import route file
var routes = require('./routes/index');
var upload = require('./routes/upload');

var app = express();

// view engine setup - jade+ejs
//app.engine('jade', webEngine.jade);
//app.engine('html', webEngine.ejs);
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.text());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//path  (path.join, fs.writeFileSync, process.exec)
var webgl_path = "/Users/hhhhm/Desktop/TankTest_WebGL/WebGL-Dist";

var gradePlayer = "C:\\Users\\hhhhm\\Desktop\\TankTest_Grade\\Assets\\Scripts\\Player\\Player.cs";
var gradePlayerId = "C:\\Users\\hhhhm\\Desktop\\TankTest_Grade\\Assets\\Scripts\\Player\\Player_ID.cs";
var webglPlayer = "C:\\Users\\hhhhm\\Desktop\\TankTest_WebGL\\Assets\\Scripts\\Player\\Player.cs";
var webglPlayerId = "C:\\Users\\hhhhm\\Desktop\\TankTest_WebGL\\Assets\\Scripts\\Player\\Player_ID.cs";
//유니티경로 -projectPath 프로젝트경로 batchmode -quit (executeMethod) 빌드종류 [생성할 파일경로 및 이름]
var gradeBuild = "\"D:\\Program Files\\Unity\\Editor\\Unity.exe\" -projectPath \"C:\\Users\\hhhhm\\Desktop\\TankTest_Grade\" -batchmode -quit -buildWindows64Player C:\\Users\\hhhhm\\Desktop\\TankTest_Grade\\test.exe";
var gradeRun = "start C:\\Users\\hhhhm\\Desktop\\TankTest_Grade\\test.exe -batchmode -nographics";
var webglBuild = "\"D:\\Program Files\\Unity\\Editor\\Unity.exe\" -projectPath \"C:\\Users\\hhhhm\\Desktop\\TankTest_WebGL\" -batchmode -quit -executeMethod WebGLBuilder.build";

//route
app.use('/', routes);
app.use('/upload', upload);
app.use('/webgl', express.static(path.join(webgl_path)));

  
app.post('/upload', function (req, res, next) {
    var id = req.body.id;
    var play = req.body.play;
    res.send('good request');
    if (play == 1) {         //score test
        //write file
        var passId = "using System.Collections;using System.Collections.Generic;using UnityEngine;public class Player_ID : MonoBehaviour{ public static int player_id = " + id + ";}"
        fs.writeFileSync(gradePlayer, req.body.source, 'utf8');
        fs.writeFileSync(gradePlayerId, passId, 'utf8');
        fs.writeFileSync(webglPlayer, req.body.source, 'utf8');
        fs.writeFileSync(webglPlayerId , passId, 'utf8');
        console.log('FileSync completed');

        //unity exe build
        process.exec(gradeBuild, function (err, stdout, stderr) {
            if (err != null)
                console.log(err);
            else{   //unity start
                console.log("build complete user - " + id);
                process.exec(gradeRun, function (err, stdout, stderr) {
                    console.log(err);
                    console.log("Unity play fin");
                });
            }
        });
    }
    else if (play == 2) {     //web view
        console.log("Web build start");
        //unity web build
        process.exec(webglBuild, function (err, stdout, stderr) {
            if (err != null)
                console.log(err);
            else {
                //print result on console
                console.log("build complete user - " + id);
            }
        });
    }
});


// error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
