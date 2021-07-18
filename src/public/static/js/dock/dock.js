import ChatBox from "./ChatBox.js"
import AutoScroll from "./AutoScroll.js"

class App {
    constructor(){
        this.chatBox = new ChatBox((data) => {
            this.sendSelectedChat(data);
        });
        this.autoScroll = new AutoScroll();
        this.autoScroll.scrollArrow();

        this.socket = io();

        this.socket.on("addDockChat", (data) => {
            this.addChat(data);
        });

        this.socket.on("clearDockChat", () => {
            this.clearChat();
        });

        this.chatStackReveived = false;

        this.socket.on("chatStack", (data) => {
            this.updateChatStack(data);
        });

        this.socket.on("selectedChat", (data) => {
            this.selectedChat(data);
        });

        this.dockChatSet = {};
    }

    selectedChat(chat){
        this.dockChatSet = chat;
        this.chatBox.chats[chat.id].buttonController.buttonClicked();
    }

    updateChatStack(chats){
        if(!this.chatStackReveived){
            this.chatStackReveived = true;
            this.chatBox.addChats(chats);
            this.autoScroll.autoScroll();
        }
    }

    sendSelectedChat(chat){
        if(this.dockChatSet.id === chat.id && this.dockChatSet.visible === chat.visible){
            //
        } else {
            this.socket.emit("selectedChatApp", chat);
            this.dockChatSet = {};
        }
    }

    addChat(chat){
        let scrollState = this.autoScroll.atBottom();
        this.chatBox.addChat(chat);
        if(scrollState) this.autoScroll.autoScroll();
    }

    clearChat(){
        this.chatBox.clearChatBox();
    }

}

let app = new App();
export default app;