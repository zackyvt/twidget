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
                break;
            case "SuperChat":
                chatDataN.template = this.appSettings.settingTemplates.SuperChat;
                if(!chatDataN.message){
                    chatDataN.template = this.appSettings.settingTemplates.SuperSticker;
                }
                break;
        }
        this.server.emitData(chatDataN);
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set(chatDataN);
    }

    setInvisible(){
        this.server.emitData({visible: false});
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set({visible: false});
    }
}