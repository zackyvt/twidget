import ChatButton from "./ChatButton.js"

export default class MessageChat {
    constructor(name, pfp, message, userStatus, id, selectedCall, unselectedCall){
        this.name = name;
        this.pfp = pfp;
        this.message = message;
        this.id = id;
        this.buttonController;
        this.selectedCall = selectedCall;
        this.unselectedCall = unselectedCall;
        this.userStatus = userStatus;
    }

    buildMessage(){
        let chatDiv = document.createElement("div");
        chatDiv.id = "chat" + this.id;
        chatDiv.classList.add("chat");
        
        if(this.userStatus == "owner"){
            chatDiv.classList.add("ownerChat");
        }

        let imagePfp = document.createElement("img");
        imagePfp.classList.add("chatPfp");
        imagePfp.src = this.pfp;

        let chatName = document.createElement("h6");
        chatName.classList.add("chatName");
        

        switch(this.userStatus){
            case "owner":
                chatName.innerHTML = "<span class='ownerName'>" + this.name + "</span>";
                break;
            case "moderator":
                chatName.innerHTML = "<span class='moderatorName'>" + this.name + " <img src='../assets/images/mod-icon.png' /></span>";
                break;
            default:
                chatName.innerHTML = this.name;
        }

        let chatMessage = document.createElement("p");
        chatMessage.classList.add("chatMessage");
        chatMessage.innerHTML = this.message;

        let chatButton = document.createElement("button");
        chatButton.classList.add("chatButton");
        chatButton.classList.add("btn");
        chatButton.classList.add("btn-success");
        chatButton.classList.add("btn-sm");

        chatDiv.appendChild(imagePfp);
        chatDiv.appendChild(chatName);
        chatDiv.appendChild(chatMessage);
        chatDiv.appendChild(chatButton);

        return chatDiv;
    }

    setButtonController(){
        this.buttonController = new ChatButton(this.id, this.selectedCall, this.unselectedCall);
    }

    unselect(){
        this.buttonController.stateSelect();
    }
}