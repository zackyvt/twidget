const express = require('express');
const path = require('path');

export default class Server {
    constructor(authCallback, authApp){
        this.authApp = authApp;
        this.app = express();
        this.authCallback = authCallback;
        this.port = 3000;
        this.url = "http://localhost:" + this.port + "/oauthcallback";
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

        this.app.listen(this.port, () => {
            serverCallback();
        });
    }
}