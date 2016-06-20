var fs = require('fs-extra');
var path = require('path');
var Gaze = require('gaze').Gaze;
var color = require('colorful');
var aimee = require('aimee-cli');
var project = { name: 'www' };
var rcpath = path.join(process.env.HOME, '.aimee-view');
var widget = path.join(rcpath, project.name, 'src/widget');
var exec = require('child_process').exec;

project.path = path.join(rcpath, project.name);

// 创建一个项目，用于预览app
function createProject(){
    return new Promise(function(res, rej){
        aimee.cli.create.project(project.name, rcpath, true, res);
    })
}

// 修改home.page调用
// home.js => this.exports(app.name)
// home.jade => #lincoapp-id-#{app.name}
function fixPage(app){
    return new Promise(function(res, rej){
        fixFile(app, 'home.js', /exports\(\'(.+)\'\)$/mig);
        fixFile(app, 'home.jade', /lincoapp\-id\-(.+)$/mig);
        res();
    });
    // 修改home.page调用
    function fixFile(app, file, reg){
        var src = path.join(rcpath, project.name, 'src/pages/home', file);
        var string = fs.readFileSync(src, 'utf-8');
        var str = string.replace(reg, function($0, $1){
            return $0.replace($1, app.name);
        });
        fs.writeFileSync(src, str, 'utf-8');
    }
}

// Copy到临时项目目录下
function copyApp(app){
    return new Promise(function(res, rej){
        fs.copy(app.path, path.join(widget, app.name), function(err, msg){
            err ? rej(err) : res(msg)
        });
    })
}

// 执行项目构建
function compile(app){
    var w, l;
    app.args.live ? l = '-L ' : l = '';
    app.args.watch ? w = '-w ' : w = '';
    return new Promise(function(res, rej){
        exec('uz release '+ w + l +'--root ' + project.path, function(err, msg){
            err ? rej(err) : res(msg)
            console.log(msg)
            if(!l && !w){
                process.exit(1)
            }
        })
    })
}

function openURL(app){
    if(app.args.o || app.args.open ){
        exec('open http://127.0.0.1:8080', function(err, msg){
            err ?
                console.log(err):
                console.log('open http://127.0.0.1:8080');
        })
    }
}

// 完整流程
function all(app, file){
    createProject()
        .then(fixPage(app))
        .then(copyApp(app))
        .then(compile(app))
        .catch(function(){
            console.log(arguments, 'aimeeview|view|58')
        })
}

// 获取app相关信息
function getApp(commander){
    var app = {};
    app.name = commander.args[0] || '';
    if(app.name === '.'){
        app.path = process.cwd();
        app.name = path.basename(app.path);
        app.dirname = path.dirname(app.path);
    }
    else{
        app.path = path.join(process.cwd(), app.name);
        app.dirname = path.dirname(app.path);
    }
    app.args = {
        open: commander.open || false,
        live: commander.live || false,
        watch: commander.watch || false
    }
    return app;
}

// 日志时间
function logDate(){
    return '[]'.split('').join(new Date(new Date().getTime() + 288e+5).toJSON().slice(5).split('T').join(' ').slice(6, 14))
}

module.exports = function(commander){
    var app = getApp(commander);
    var gaze = new Gaze('**/*', {'mode': 'poll', cwd: app.path});

    if(app.name){
        // 创建临时项目路径
        fs.mkdirpSync(rcpath);
        // 是否监听
        if(commander.watch){
            gaze.on('ready', function(){
                all(app);
                console.log(color.green('Watching'), color.cyan(app.name));
            })
            gaze.on('all', function(ev, filepath){
                var file = {
                    path: filepath,
                    name: path.join(app.name, path.basename(filepath))
                };
                copyApp(file);
                console.log(color.gray(logDate()), file.name, color.green(ev));
            })
        }
        else{
            all(app)
        }
    }
    else{
        console.log('Need appname.')
    }
}
