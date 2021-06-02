export default class SourceConnection {
    constructor(firebase, appSettings){
        this.firebase = firebase;
        this.appSettings = appSettings;
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
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set(chatDataN);
    }

    setInvisible(){
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set({visible: false});
    }
}