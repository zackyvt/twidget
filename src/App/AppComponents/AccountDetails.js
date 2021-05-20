import app from "../App.js"

export default class AccountDetails {
    constructor(name, pfp, signOutCall){
        this.name = name;
        this.pfp = pfp;
        this.signOutCall = signOutCall;

        this.nameText = document.querySelector("#nameText");
        this.pfpImage = document.querySelector("#pfpImage");
        this.signOutLink = document.querySelector("#signOutLink");

        this.setDetails();
        this.signOutLink.addEventListener("click", () => {signOutCall.call(app)});
    }

    setDetails(){
        this.nameText.innerHTML = this.name;
        this.pfpImage.src = this.pfp;
    }
}