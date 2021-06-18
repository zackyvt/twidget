import MessageChat from "./MessageChat.js"
import SuperChat from "./SuperChat.js"

export default class ChatBox {
    constructor(chatSetCallback){
        this.chats = [];  
        this.chatsRaw = [];
        this.chatSetCallback = chatSetCallback;
        this.chatBox = document.querySelector("#chatBox");
        this.clearChatBox();
    }

    addChats(chats){
        for(let i=0; i<chats.length; i++){
            this.addChat(chats[i]);
        }
    }

    addChat(chat){
        let newChat;
        if(chat.type == "MessageChat"){
            newChat = new MessageChat(chat.name, chat.pfp, chat.message, chat.userStatus, this.chats.length, this.messageSelected, this.messageUnselected);
        } else if(chat.type == "SuperChat"){
            newChat = new SuperChat(chat.name, chat.pfp, chat.message, chat.amount, chat.tier, this.chats.length, this.messageSelected, this.messageUnselected);
        }
        this.chatBox.appendChild(newChat.buildMessage());
        this.chatsRaw.push(chat);
        this.chatsRaw[this.chatsRaw.length - 1].visible = true;
        this.chats.push(newChat);
        newChat.setButtonController();
    }

    displayLoading(){
        this.chatBox.classList.add("chatBoxLoading");
    }

    hideLoading(){
        this.chatBox.classList.remove("chatBoxLoading");
    }

    clearChatBox(){
        this.chatBox.innerHTML = "<div class='loading'>Loading</div>";
        this.chatBox.classList.remove("chatBoxLoading");
    }

    messageSelected(id){
        for(let i=0; i<this.chats.length; i++){
            if(i==id){
                continue;
            }
            this.chats[i].unselect();
        }
        console.log("Chat " + id + " selected");
        this.chatSetCallback(this.chatsRaw[id]);
    }

    messageUnselected(id){
        console.log("Chat " + id + " unselected");
        this.chatSetCallback({visible: false});
    }
}