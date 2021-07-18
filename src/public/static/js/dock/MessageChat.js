import ChatButton from "./ChatButton.js"

export default class MessageChat {
    constructor(name, pfp, message, userStatus, platform, id, selectedCall, unselectedCall){
        this.name = name;
        this.pfp = pfp;
        this.message = message;
        this.id = id;
        this.buttonController;
        this.selectedCall = selectedCall;
        this.unselectedCall = unselectedCall;
        this.userStatus = userStatus;
        this.platform = platform;
    }

    buildMessageAlt(){
        let openDiv = '<div class="chat' + (this.userStatus == "owner" ? " ownerChat" : "") + '" id="chat' + this.id + '" >'
        
        let imagePfp = '<img class="chatPfp" src="' + this.pfp + '" />';

        let platformSrc;
        if(this.platform == "youtube"){
            platformSrc = "https://image.flaticon.com/icons/png/512/187/187209.png";
        } 
        if(this.platform == "facebook"){
            platformSrc = "https://image.flaticon.com/icons/png/512/145/145802.png";
        }
        if(this.platform == "twitch"){
            platformSrc = "https://image.flaticon.com/icons/png/128/3938/3938147.png";
        }

        let platformLogo = '<img class="chatPlatformLogo" src="' + platformSrc + '" />';

        let chatNameContent;
        switch(this.userStatus){
            case "owner":
                chatNameContent = "<span class='ownerName'>" + this.name + "</span>";
                break;
            case "moderator":
                chatNameContent = "<span class='moderatorName'>" + this.name + " <img src='/static/images/mod-icon.png' /></span>";
                break;
            default:
                chatNameContent = this.name;
        }

        let chatName = '<h6 class="chatName">' + chatNameContent + '</h6>';
        let chatMessage = '<p class="chatMessage">' + this.message + '</p>';
        let chatButton = '<button class="chatButton btn btn-success btn-sm"></button>';

        let chatDiv = openDiv + imagePfp + platformLogo + chatName + chatMessage + chatButton + "</div>";
        
        return chatDiv;
    }

    buildMessage(){
        return this.buildMessageAlt();

        let chatDiv = document.createElement("div");
        chatDiv.id = "chat" + this.id;
        chatDiv.classList.add("chat");
        
        if(this.userStatus == "owner"){
            chatDiv.classList.add("ownerChat");
        }

        let imagePfp = document.createElement("img");
        imagePfp.classList.add("chatPfp");
        imagePfp.src = this.pfp;

        let platformLogo = document.createElement("img");
        platformLogo.classList.add("chatPlatformLogo");

        if(this.platform == "youtube"){
            platformLogo.src = "https://image.flaticon.com/icons/png/512/187/187209.png";
        } 
        if(this.platform == "facebook"){
            platformLogo.src = "https://image.flaticon.com/icons/png/512/145/145802.png";
        }
        if(this.platform == "twitch"){
            platformLogo.src = "https://image.flaticon.com/icons/png/128/3938/3938147.png";
        }

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
        chatDiv.appendChild(platformLogo);
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