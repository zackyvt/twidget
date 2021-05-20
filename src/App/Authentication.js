const firebase = require("firebase/app");
require("firebase/database");
require("firebase/auth");
require("firebase/analytics");

const Store = require('electron-store');

const {google} = require('googleapis');

import Server from './Server.js'

export default class Authentication {
    constructor(signInCallback, appObject) {
        this.firebase = firebase;

        const firebaseConfig = {
            apiKey: "AIzaSyBAm2dGJlw4wwn_ERLsjAXhxg9qqzZYFFg",
            authDomain: "twidgetapp.firebaseapp.com",
            databaseURL: "https://twidgetapp-default-rtdb.firebaseio.com",
            projectId: "twidgetapp",
            storageBucket: "twidgetapp.appspot.com",
            messagingSenderId: "312903507691",
            appId: "1:312903507691:web:546eee7418658589d368ae",
            measurementId: "G-HGFQ6VB56C"
          };

        this.firebase.initializeApp(firebaseConfig);
        this.firebase.analytics();

        this.authData = {};
        this.server;
        this.oauth2Client;
        this.store = new Store();
        this.signInCallback = signInCallback;
        this.appObject = appObject;
    }

    /* Authentication Initialization*/
    initializeAuth(){
        return new Promise((resolve, reject) => {
            this.server = new Server(this.handleAuthCode, this);
            this.server.startServer(() => {
                this.oauth2Client = new google.auth.OAuth2(
                    "312903507691-vu8hqb16ubvj83adoj910i01da6inrlk.apps.googleusercontent.com",
                    "RQyl6ZNNnY2ocavQ_aLJ5iJZ",
                    this.server.url
                );
        
                this.oauth2Client.on('tokens', (tokens) => {
                    if (tokens.refresh_token) {
                      this.authData.refresh_token = tokens.refresh_token;
                    }
                    this.authData.access_token = tokens.access_token;
                });

                this.getLocalUser().then((data) => {resolve(data);}).catch((error) => {reject(error);})
            });
        });
    }

    /* Load basic user data quickly */
    quickLoadUser(){
        return new Promise((resolve, reject) => {
            if(this.store.get('refresh_token') !== undefined){
                this.authData.refresh_token = this.store.get('refresh_token');
                this.authData.name = this.store.get('name');
                this.authData.pfp = this.store.get('pfp');
                resolve(this.authData);
            } else {
                resolve(false);
            }
        }); 
    }

    /* Get Local User if Stored */
    getLocalUser(){
        return new Promise((resolve, reject) => {
            if(this.store.get('refresh_token') === undefined){
                resolve(false);
            } else {
                this.oauth2Client.setCredentials({
                    refresh_token: this.store.get('refresh_token')
                });
                this.processUser().then(() => {
                    resolve(this.authData);
                }).catch((error) => {reject(error);})
            }
        });
    }

    /* Set Local User after Auth Process */
    setLocalUser(){
        this.store.set('refresh_token', this.oauth2Client.credentials.refresh_token);
        this.store.set('name', this.authData.name);
        this.store.set('pfp', this.authData.pfp)
    }

    /* Sign Out - clear local user */
    signOut(){
        return new Promise((resolve, reject) => {
            this.store.delete("refresh_token");
            this.authData = {};
            this.oauth2Client.credentials = {};
            this.firebase.auth().signOut().then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /* Start the authentication process */
    processUser(){
        return new Promise((resolve, reject) => {
            this.getUserData().then(() => {
                this.firebaseAuthentication().then(() => {
                    this.storeUser().then(() => {resolve();}).catch((error) => {reject(error);})
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /* Handle oauth callback from sign in */
    handleAuthCode(authCode){
        this.signInCallback.call(this.appObject, null, {"preprocess": true}, null);
        this.oauth2Client.getToken(authCode).then((val) => {
            this.oauth2Client.setCredentials(val.tokens);
            this.processUser().then(() => {
                this.signInCallback.call(this.appObject, false, this.authData);
            }).catch((error) => {
                this.signInCallback(this.appObject, error, null);
            });
        });
    }

    /* Launch sign in popup */
    signIn() {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/youtube.readonly'
        ];
        let url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        require("electron").shell.openExternal(url);
    }

    /* Authentication process: get user data, sign in with firebase, store user */

    getUserData(){
        return new Promise((resolve, reject) => {
            google.oauth2("v2").userinfo.v2.me.get({auth: this.oauth2Client}, (e, profile) => {
                if(e){
                    this.appObject.signOut.call(this.appObject);
                    reject(e);
                } else {
                    this.authData.email = profile.data.email;
                    this.youtube = google.youtube({
                        version: "v3", auth: this.oauth2Client
                    });
                    this.youtube.channels.list({
                        part: "snippet",
                        mine: true
                    }).then((val) => {
                        this.authData.refresh_token = this.oauth2Client.credentials.refresh_token;
                        this.authData.access_token = this.oauth2Client.credentials.access_token;
                        this.authData.name = val.data.items[0].snippet.title;
                        this.authData.id = val.data.items[0].id;
                        this.authData.pfp = val.data.items[0].snippet.thumbnails.default.url;
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                }
            });
        })
    }

    firebaseAuthentication(){
        return new Promise((resolve, reject) => {
            let credential = this.firebase.auth.GoogleAuthProvider.credential(this.oauth2Client.credentials.id_token);
            this.firebase.auth().signInWithCredential(credential).then((val) => {
                this.server.startSource(this.oauth2Client.credentials.id_token);
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    storeUser(){
        return new Promise((resolve, reject) => {
            this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid).set({
                name: this.authData.name,
                pfp: this.authData.pfp,
                email: this.authData.email,
                refresh_token: this.authData.refresh_token,
                access_token: this.authData.access_token,
                data: {"visible": false}
            }).then(() => {
                this.setLocalUser();
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

}