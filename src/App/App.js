import Authentication from "./Authentication.js"
import ChatFeed from "./ChatFeed.js"
import SourceConnection from "./SourceConnection.js"

import ChatBox from "./AppComponents/ChatBox.js"
import AccountDetails from "./AppComponents/AccountDetails.js"
import StreamButton from "./AppComponents/StreamButton.js"

const { ipcRenderer } = require('electron')

class App {
    constructor() {
        this.streamButton;
        this.accountDetails;
        this.chatBox;
        this.auth;
        this.chatFeed;
        this.sourceConnection;
    }

    initializeMain(){
        /* Construct app components */
        this.chatBox = new ChatBox((data) => {
            this.sourceConnection.setChat(data);
        });
        this.streamButton = new StreamButton(this.startService, this.stopService);
        this.auth = new Authentication(this.handleSignIn, this);

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

            /* Construct new account details with true auth user */
            this.accountDetails = new AccountDetails(this.auth.authData.name, this.auth.authData.pfp, this.signOut);
            this.sourceConnection = new SourceConnection(this.auth.firebase);
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
        window.location.href = "login.html";
    }

    signOut(){
        this.auth.signOut().then(() => {
            console.log("Sign Out Success");
            this.initializeLogin();
        }).catch((error) => {this.logError(error, "Sign Out Error!")});
    }

    startService(){
        return new Promise((resolve, reject) => {
            if(this.sourceConnection){
                /* Get URL and connect to chat feed */
                Swal.fire({
                    titleText: "Stream Connection",
                    text: "Enter the youtube livestream URL",
                    input: "url",
                    showCancelButton: true,
                    confirmButtonTetx: "Connect",
                    validationMessage: "Invalid URL. Please also make sure the URL contains the \"https://\" text"
                }).then((value) => {
                    console.log(value);
                    if(value.isDismissed || value.isDenied){
                        resolve(false);
                    } else {
                        this.startChatFeed(this.parseYoutubeLink(value.value)).then((state) => {resolve(state);});
                    }
                });
            }
        });
    }

    startChatFeed(link){
        return new Promise((resolve, reject) => {
            /* Construct Chat Feed */
            this.chatFeed = new ChatFeed(this.auth.oauth2Client, link, (error, chat) => {
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
                resolve(false);
                this.logError(error);
            });
        });
    }

    parseYoutubeLink(link){
        let res = link;
        res = link.split("/");
        res.splice(0,2);
        switch(res[0]){
            case "studio.youtube.com":
              return res[2];
              break;
          case "youtu.be":
              return res[1];
              break;
          case "www.youtube.com":
              return res[1].split("=")[1].split("&")[0];
              break;
        }
    }

    stopService(){
        return new Promise((resolve, reject) => {
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