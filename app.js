var path = require('path');
var fs = require('fs-extra');
var is = require('aimee-is');
var commander = require('commander');
var config = fs.readJsonSync(path.join(__dirname, './package.json'));

commander
    .version(config.version)
    .option('-w, --watch', 'monitor the changes of app')
    .option('-c, --clean', 'clean compile cache')
    .option('-o, --open', 'open server url')
    .option('-L, --live', 'automatically reload your browser')

commander
    .command('clean')
    .description('clean project cache')
    .action(function(){
        fs.removeSync(path.join(process.env.HOME, '.aimee-view/www'));
    })

commander.parse(process.argv)

if(commander.open){
    require('child_process').exec('open http://127.0.0.1:8080', function(err, msg){
        err ?
            console.log(err):
            console.log('open http://127.0.0.1:8080');
    })
}
else if(!commander.args.length){
    commander.outputHelp();
}

if(!commander.clean){
    require('./view')(commander)
}
