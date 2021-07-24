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
        this.currentData = {};
        this.noSocket = true;
        this.chatStack;
        this.selectedChatCallback;
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

        this.app.get('/dock', (req, res) => {
            res.render("dock");
        });

        this.app.get('/chatflow', (req, res) => {
            res.render("chatflow");
        });

        this.app.get('/facebookconnected', (req, res) => {
            res.send("connected");
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

        this.io.on("connection", (socket) => {
            console.log("Made socket connection");

            if(!this.currentData.visible && this.noSocket){
                this.io.emit('displayLabel', {});
            }
            if(this.currentData.visible && this.noSocket){
                this.io.emit('newChat', this.currentData);
            } 
            if(!this.noSocket){
                this.io.emit('newChat', this.currentData);
            }
            if(this.chatStack){
                this.io.emit('chatStack', this.chatStack);
            }

            this.noSocket = false;

            socket.on("selectedChatApp", (data) => {
                this.selectedChatCallback(data);
            });
        });
    }

    emitData(data){
        this.currentData = data;
        this.io.emit('newChat', data);
    }
    
    addDockChat(chat){
        this.io.emit('addDockChat', chat);
    }

    clearDockChat(){
        this.io.emit('clearDockChat');
    }

    preloadImage(imageUrl){
        this.io.emit('preloadImage', imageUrl);
    }

    setSelectedChat(chat){
        this.io.emit('selectedChat', chat);
    }
}