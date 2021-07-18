export default class SourceConnection {
    constructor(firebase, appSettings, server, chatbox){
        this.firebase = firebase;
        this.appSettings = appSettings;
        this.server = server;
        this.chatStack = [];
        this.chatbox = chatbox;
        this.dockChatSet = {};
    }

    initializeSourceConnection(){
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').on('value', (snapshot) => {
            console.log(snapshot.val());
        });
    }

    preloadImage(chat){
        this.server.preloadImage(chat.pfp);
    }

    setChat(chatData){
        if(this.dockChatSet.id === chatData.id && this.dockChatSet.visible === chatData.visible){
            //
        } else {
            this.server.setSelectedChat(chatData);
            this.dockChatSet = {};
        }

        let chatDataN = chatData;
        switch(chatDataN.type){
            case "MessageChat":
                chatDataN.template = this.appSettings.settingTemplates.MessageChat;
                this.server.authApp.analytics.logEvent("socketSet", {type: "MessageChat", template: chatDataN.template, userStatus: chatDataN.userStatus});
                break;
            case "SuperChat":
                chatDataN.template = this.appSettings.settingTemplates.SuperChat;
                if(!chatDataN.message){
                    chatDataN.template = this.appSettings.settingTemplates.SuperSticker;
                    this.server.authApp.analytics.logEvent("socketSet", {type: "SuperSticker", template: chatDataN.template, tier: chatDataN.tier});
                } else {
                    this.server.authApp.analytics.logEvent("socketSet", {type: "SuperChat", template: chatDataN.template, tier: chatDataN.tier});
                }
                break;
        }
        this.server.emitData(chatDataN);
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set(chatDataN);
    }
    
    addDockChat(chat){
        if(!this.server.selectedChatCallback){
            this.server.selectedChatCallback = (data) => {
                this.dockChatSet = data;
                this.chatbox.chats[data.id].buttonController.buttonClicked();
            };
        }

        if(!chat){
            this.chatStack = [];
            this.server.clearDockChat();
        } else {
            this.chatStack.push(chat);
            this.server.addDockChat(chat);
        }
        this.server.chatStack = this.chatStack;
    }

    setInvisible(){
        this.server.authApp.analytics.logEvent("socketSet", {type: "invisible"});
        this.server.emitData({visible: false});
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set({visible: false});
    }
}