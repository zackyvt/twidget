export default class SourceConnection {
    constructor(firebase, appSettings, server){
        this.firebase = firebase;
        this.appSettings = appSettings;
        this.server = server;
    }

    initializeSourceConnection(){
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').on('value', (snapshot) => {
            console.log(snapshot.val());
        });
    }

    setChat(chatData){
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

    setInvisible(){
        this.server.authApp.analytics.logEvent("socketSet", {type: "invisible"});
        this.server.emitData({visible: false});
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set({visible: false});
    }
}