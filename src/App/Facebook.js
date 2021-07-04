const axios = require('axios');

export default class Facebook {
    constructor(auth){
        this.auth = auth;
        this.appId = "2828879854089642";
        this.redirectUri = "https://us-central1-twidgetapp.cloudfunctions.net/facebookoauth";
        this.state = this.auth.firebase.auth().currentUser.uid;
        this.accessToken;
        this.chatSource;
    }

    signIn(){
        let authURL = "https://www.facebook.com/v11.0/dialog/oauth?client_id=" + this.appId + "&redirect_uri=" + this.redirectUri + "&state=" + this.state + "&scope=user_videos";
        require("electron").shell.openExternal(authURL);
    }

    getAccessToken(callback){
        this.auth.firebase.database().ref('users/' + this.auth.firebase.auth().currentUser.uid + '/facebookAuth').on('value', (snapshot) => {
            if(snapshot.val()){
                this.accessToken = snapshot.val();
                callback(this.accessToken);
            }
        });
    }

    loadChats(videoId, callback){
        this.chatSource = new EventSource("https://streaming-graph.facebook.com/" + videoId + "/live_comments?access_token=" + this.accessToken + "&comment_rate=ten_per_second&fields=from{name, picture},message");
        this.chatSource.onmessage = (event) => {
            callback(event.data);
        };
    }

    parseFacebookChat(chats){
        let jsonChats = JSON.parse(chats);
        return {
            type: "MessageChat",
            name: jsonChats.from.name,
            message: jsonChats.message,
            pfp: (jsonChats.from.picture.data.url).replace('\\', ''),
            userStatus: "normal",
            platform: "facebook"
        };
    }
}