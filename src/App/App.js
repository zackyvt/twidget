import Authentication from "./Authentication.js"
import ChatFeed from "./ChatFeed.js"
import SourceConnection from "./SourceConnection.js"

import ChatBox from "./AppComponents/ChatBox.js"
import AccountDetails from "./AppComponents/AccountDetails.js"
import StreamButton from "./AppComponents/StreamButton.js"
import AppTutorial from "./AppComponents/AppTutorial.js"
import AppSettings from "./AppComponents/AppSettings.js"

import Facebook from "./Facebook.js"
import ConnectionForm from "./AppComponents/ConnectionForm.js"

const { ipcRenderer } = require('electron')
const appVersion = require('electron').remote.app.getVersion();

class App {
    constructor() {
        this.streamButton;
        this.accountDetails;
        this.chatBox;
        this.auth;
        this.chatFeed;
        this.sourceConnection;
        this.appTutorial;
        this.appSettings;
    }

    initializeMain(){
        /* Construct app components */
        this.chatBox = new ChatBox((data) => {
            this.sourceConnection.setChat(data);
        });
        this.streamButton = new StreamButton(this.startService, this.stopService);
        this.auth = new Authentication(this.handleSignIn, this);
        this.appTutorial = new AppTutorial();
        this.appSettings = new AppSettings();

        document.querySelector("#version").innerHTML = "Version " + appVersion;

        /* Quick load user details if exists */
        this.auth.quickLoadUser().then((exists) => {
            if(exists){
                ipcRenderer.send('stopLoad');
                this.accountDetails = new AccountDetails(this.auth.authData.name, this.auth.authData.pfp, this.signOut);
            } else {
                this.initializeLogin();
            }
        });

        /* Authenticate the user */
        this.auth.initializeAuth().then((authState) => {
            console.log("here");
            console.log(authState);
            if(!authState){
                this.initializeLogin();
            }

            this.auth.analytics.logEvent('signed_in');
            this.auth.analytics.setUserProperties({version: appVersion});

            /* Construct new account details with true auth user */
            this.accountDetails = new AccountDetails(this.auth.authData.name, this.auth.authData.pfp, this.signOut);
            this.sourceConnection = new SourceConnection(this.auth.firebase, this.appSettings, this.auth.server);
            this.sourceConnection.initializeSourceConnection();
            if(this.streamButton.buttonState == "wait"){
                this.streamButton.buttonState = "start";
                this.streamButton.buttonClicked();
            }
        }).catch((error) => {this.logError(error)});
    }

    logError(error, title = "Error!"){
        console.error(error);
        Swal.fire({
            titleText: title,
            text: error,
            icon: "error",
            footer: "Contact zackytalib3@gmail.com regarding this issue"
        });
    }

    initializeLogin(){
        this.auth.analytics.logEvent('goto_login');
        window.location.href = "login.html";
    }

    signOut(){
        this.auth.signOut().then(() => {
            console.log("Sign Out Success");
            this.auth.analytics.logEvent('signout');
            this.initializeLogin();
        }).catch((error) => {this.logError(error, "Sign Out Error!")});
    }

    startService(){
        return new Promise((resolve, reject) => {
            if(this.sourceConnection){
                let facebook = new Facebook(this.auth);
                let connectionForm = new ConnectionForm(facebook, this.auth);
                connectionForm.showPopup((status, values) => {
                    if(!status){
                        this.auth.analytics.logEvent('start_service', {state: "canceled"});
                        resolve(false);
                    } else {
                        this.auth.analytics.logEvent('start_service', {state: "success"});
                        this.startChatFeed(values, facebook).then((state) => {
                            resolve(state);
                        });
                    }
                });
            }
        });
    }

    startChatFeed(links, facebook){
        return new Promise((resolve, reject) => {
            /* Construct Chat Feed */
            this.chatFeed = new ChatFeed(this.auth, links, facebook, (error, chat) => {
                if(error){
                    if(this.streamButton.buttonState == "stop"){
                        this.streamButton.buttonClicked();
                    }
                    this.logError(error);
                } else {
                    this.chatBox.addChat(chat)
                }
            }, this);

            /* Initialize Chat Feed */
            this.chatFeed.initializeChatFeed().then(() => {
                resolve(true);
            }).catch((error) => {
                this.logError(error);
                resolve(false);
            });
        });
    }

    stopService(){
        return new Promise((resolve, reject) => {
            this.auth.analytics.logEvent('stop_service');
            this.chatFeed.clearChatFeed();
            this.chatBox.clearChatBox();
            this.chatFeed = null;
            this.sourceConnection.setInvisible();
            resolve(true);
        }); 
    }
}

const app = new App();
app.initializeMain();
export default app;