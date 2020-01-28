#!/usr/bin/env node
var speedTest    =  require('speedtest-net');
var ProgressBar  =  require('progress');
var chalk        =  require("chalk");

var test = speedTest({maxTime:5000});

var bar,pingTime;

// Event triggered when best Server is found.

test.on('testserver', function(server) {
    pingTime = server.bestPing;
});

test.on('downloadprogress', function(val){
    prog('Checking Download Speed ', val);
});

test.on('uploadprogress', function(val){
    prog('Checking Upload Speed ', val);
});

test.on('data',function(data){
    console.log(chalk.cyan("Ping : "), Math.abs(pingTime),chalk.dim('ms'));
    console.log(chalk.cyan("Download Speed : ") + data.speeds.download + chalk.dim(" MBps"));
    console.log(chalk.cyan("Upload Speed : ") + data.speeds.upload + chalk.dim(" MBps"));
});

// in case of error, exit.

test.on('error',function(error){
    process.exit(1);
});

function prog(info, val){
    // if its completed, terminate current progress.
    if (val>=100){
         if (bar) bar.terminate();
        bar=null;
        return;
    }
    // if bar object is not created
      if (!bar) {
        // var green = 'u001b[42m u001b[0m',
        //       red = 'u001b[41m u001b[0m';
        bar = new ProgressBar(' '+info+' [:bar] :percent', {
            complete: '=',
            incomplete: ' ',
            clear: true,
            width:40,
            total: 100
        });
    }
    
    // else update the bar with coming value.
    bar.update(val/100);
}
