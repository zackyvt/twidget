const express = require('express');
const socket = require("socket.io");
const path = require('path');

export default class Server {
    constructor(authCallback, authApp){
        this.authApp = authApp;
        this.app = express();
        this.authCallback = authCallback;
        this.port = 3000;
        this.url = "http://localhost:" + this.port + "/oauthcallback";
        this.server;
        this.io;
    }

    startSource(credential){
        this.app.get('/source', (req, res) => {
            res.render('source', {credential: credential});
        });
    }

    startServer(serverCallback){
        this.app.use('/static', express.static(path.join(__dirname, '../public/static')))
        this.app.set('views', path.join(__dirname, '../public/views'));
        this.app.set('view engine', 'ejs');

        this.app.get('/', (req, res) => {
            res.sendStatus(200);
        });

        this.app.get('/oauthcallback', (req, res) => {
            this.authCallback.call(this.authApp, req.query.code);
            res.render('oauthRedirect');
        });

        this.server = this.app.listen(this.port, () => {
            serverCallback();
        });

        this.clientCommunication();
    }

    clientCommunication(){
        this.io = socket(this.server);

        this.io.on("connection", function (socket) {
            console.log("Made socket connection");
            socket.broadcast.emit()
        });
    }

    emitData(data){
        this.io.emit('newChat', data);
    }
}