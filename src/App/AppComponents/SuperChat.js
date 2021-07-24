import ChatButton from "./ChatButton.js"

export default class SuperChat {
    constructor(name, pfp, message, amount, tier, id, selectCall, unselectCall){
        this.name = name;
        this.pfp = pfp;
        this.message = message;
        this.id = id;
        this.amount = amount;
        this.tier = tier > 7 ? 6 : tier-1;

        this.tierColor = [
            ["#1565c0", "", "rgb(255 255 255 / 70%)", "#ffffff"],
            ["#00b8d4", "#00e5ff", "#000000", "#000000"],
            ["#00bfa5", "#1de9b6", "#000000", "#000000"],
            ["#ffb300", "#ffca28", "#000000", "#000000"],
            ["#e65100", "#f57c00", "rgb(255 255 255 / 70%)", "#ffffff"],
            ["#c2185b", "#e91e63", "rgb(255 255 255 / 70%)", "#ffffff"],
            ["#d00000", "#e62117", "rgb(255 255 255 / 70%)", "#ffffff"]
        ][this.tier];

        this.buttonController;
        this.selectCall = selectCall;
        this.unselectCall = unselectCall;
    }

    buildMessageAlt(){
        let openDiv = '<div id="chat' + this.id + '" class="superchat" style="background-color: ' + this.tierColor[0] + ';">';
        let pfp = '<img class="superchatPfp" src="' + this.pfp + '"/>';
        let name = '<h6 class="superchatName" style="color: ' + this.tierColor[2] + ';">' + this.name + '</h6>';
        let amount = '<h5 class="superchatAmount" style="color: ' + this.tierColor[3] + ';">' + this.amount + '</h5>';
        let button = '<button class="superchatButton btn btn-success btn-sm"></button>';
        let chatMessageContent = "";
        if(this.message !== "" && this.tier !== 0){
            chatMessageContent = '<p>' + this.message + '</p>';
        }
        let message = '<div class="superchatMessage" style="background-color: ' + this.tierColor[1] + '; color: ' + this.tierColor[2] + ';">' + chatMessageContent + "</div>";

        let chatDiv = openDiv + pfp + name + amount + button + message + "</div>";
        return chatDiv;
    } 

    buildMessage(){
        return this.buildMessageAlt();

        let chatDiv = document.createElement("div");
        chatDiv.id = "chat" + this.id;
        chatDiv.classList.add("superchat");
        chatDiv.style.backgroundColor = this.tierColor[0];

        let chatPfp = document.createElement("img");
        chatPfp.classList.add("superchatPfp");
        chatPfp.src = this.pfp;

        let chatName = document.createElement("h6");
        chatName.classList.add("superchatName");
        chatName.innerHTML = this.name
        chatName.style.color = this.tierColor[2];

        let chatAmount = document.createElement("h5");
        chatAmount.classList.add("superchatAmount");
        chatAmount.innerHTML = this.amount;
        chatAmount.style.color = this.tierColor[3];

        let chatButton = document.createElement("button");
        chatButton.classList.add("superchatButton");
        chatButton.classList.add("btn");
        chatButton.classList.add("btn-success");
        chatButton.classList.add("btn-sm");

        let chatMessage = document.createElement("div");
        chatMessage.classList.add("superchatMessage");
        chatMessage.style.backgroundColor = this.tierColor[1];
        chatMessage.style.color = this.tierColor[2];

        if(this.message !== "" && this.tier !== 0){
            let chatMessageContent = document.createElement("p");
            chatMessageContent.innerHTML = this.message;
    
            chatMessage.appendChild(chatMessageContent);
        }

        chatDiv.appendChild(chatPfp);
        chatDiv.appendChild(chatName);
        chatDiv.appendChild(chatAmount);
        chatDiv.appendChild(chatButton);
        chatDiv.appendChild(chatMessage);

        return chatDiv;
    }

    setButtonController(){
        this.buttonController = new ChatButton(this.id, this.selectCall, this.unselectCall);
    }

    unselect(){
        this.buttonController.stateSelect();
    }
}