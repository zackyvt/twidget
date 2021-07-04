const { spawn } = require('child_process');
const path = require('path');
const kill = require('tree-kill');

function fixPathForAsarUnpack(path){
    return path.replace("app.asar", "app.asar.unpacked");
}

export default class Processor {
    constructor(callback){
        this.callback = callback;
        this.child;
        this.first = true;
    }

    async runProcessor(liveChatID) {
        this.child = spawn(fixPathForAsarUnpack(path.join(__dirname, '../processor.exe')), [liveChatID], {windowsHide: true});
    
        this.child.stdout.setEncoding('utf8');
    
        this.child.stdout.on('data', (data) => {
            console.log(JSON.parse(data));
            this.callback(JSON.parse(data).data, this.first);
            this.first = false;
        });
    
        this.child.stderr.on('data', (data) => {
            console.error(data);
        });
    
        this.child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    async endProcess(){
        kill(this.child.pid);
    }
    
}