import Authentication from "./Authentication.js"
import Server from './Server.js';

const { ipcRenderer } = require('electron')

class Login {
    constructor(){
        this.auth;
    }

    initializeLogin(){
        ipcRenderer.send('stopLoad');
        this.auth = new Authentication(this.handleSignIn, this);

        /* Check if quick loaded user exists */
        this.auth.quickLoadUser().then((exists) => {
            if(exists){
                this.initializeMain();
            }
        });

        /* Initialize user auth */
        this.auth.initializeAuth().then((authState) => {
            console.log(authState);
            if(authState){
                this.initializeMain();
            }
            document.querySelector("#loginButton").addEventListener("click", () => {this.loginButton()});
        }).catch((error) => {this.logError(error);});
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

    initializeMain(){
        window.location.href = "index.html";
    }

    loginButton(){
        this.auth.signIn();
    }

    handleSignIn(error, result){
        if(error){
            this.logError(error);
            document.querySelector(".signInLoad").style.display = "none";
        } else {
            if(result.preprocess){
                document.querySelector(".signInLoad").style.display = "block";
            } else {
                this.initializeMain();
            }
        }
    }

}

const loginApp = new Login();
loginApp.initializeLogin();
export default loginApp;