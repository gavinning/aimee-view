var path = require('path');
var fs = require('fs-extra');
var is = require('aimee-is');
var commader = require('commander');
var config = fs.readJsonSync(path.join(__dirname, './package.json'));

commader
    .version(config.version)
    .option('-w, --watch', 'monitor the changes of app')
    .option('-o, --open', 'open server url')
    .option('-L, --live', 'automatically reload your browser')
    .parse(process.argv)

if(commader.open){
    require('child_process').exec('open http://127.0.0.1:8080', function(err, msg){
        err ?
            console.log(err):
            console.log('open http://127.0.0.1:8080');
    })
}
else if(!commader.args.length){
    commader.outputHelp();
}else{
    require('./view')(commader)
}
