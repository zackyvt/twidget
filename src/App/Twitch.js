const axios = require('axios');

export default class Twitch {
    constructor(auth){
        this.auth = auth;
        this.redirectUri = "https://us-central1-twidgetapp.cloudfunctions.net/twitchoauth";
        this.clientId = "753rqadn5nlwjhht5yyzomp2y6teyv";
        this.scope = "chat:read";
        this.state = this.auth.firebase.auth().currentUser.uid;
        this.accessToken;
        this.refreshToken;
    }


    signIn(){
        let authUrl = "https://id.twitch.tv/oauth2/authorize?client_id=" + this.clientId + "&redirect_uri=" + this.redirectUri + "&response_type=code&scope=chat:read&force_verify=true&state=" + this.state;
        require("electron").shell.openExternal(authUrl);
    }

    getAccessToken(callback){
        this.auth.firebase.database().ref('users/' + this.auth.firebase.auth().currentUser.uid + '/platforms/twitch').on('value', (snapshot) => {
            if(snapshot.val()){
                this.accessToken = snapshot.val().access_token;
                this.refreshToken = snapshot.val().refresh_token;
                callback(snapshot.val());
            }
        });
    }

    loadChats(channel_name, callback){
        const tmi = require('tmi.js');
        const client = new tmi.Client({
	        options: { debug: true, messagesLogLevel: "info", clientId: "753rqadn5nlwjhht5yyzomp2y6teyv" },
	        connection: {
		        reconnect: true,
		        secure: true
	        },
	        identity: {
		        username: 'zackytalib3',
		        password: 'oauth:snnvuv56sgct9l0gjajmvd2km9xh0n',
	        },
	        channels: [channel_name]
        });
        client.connect().catch(console.error);
        client.on('message', (channel, tags, message, self) => {
            if(self) return;
            callback({user: tags, message:message});
        });
    }

    parseTwitchChat(chats){
        return {
            type: "MessageChat",
            name: chats.user["display-name"],
            message: chats.message,
            pfp: "https://static-cdn.jtvnw.net/user-default-pictures-uv/13e5fa74-defa-11e9-809c-784f43822e80-profile_image-300x300.png",
            userStatus: (chats.user.mod ? "moderator" : "normal"),
            platform: "twitch"
        }
    }
}