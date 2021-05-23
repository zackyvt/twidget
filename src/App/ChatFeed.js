const {google} = require('googleapis');

String.prototype.escape = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};

export default class ChatFeed {
    constructor(auth, broadcastId, chatCallback, app){
        this.broadcastId = broadcastId;
        this.auth = auth;
        this.api = google.youtube({version: "v3", auth: this.auth});
        this.nextPageToken;
        this.liveChatId;
        this.chatCallback = chatCallback;
        this.app = app;
        this.chatFeedInterval;
        this.chats = [];
    }

    initializeChatFeed(){
        return new Promise((resolve, reject) => {
            this.getBroadcast().then((broadcast) => {
                this.liveChatId = broadcast.liveChatId;
                this.loadLiveChats();
                this.chatFeedInterval = window.setInterval(() => {this.loadLiveChats();}, 5000);
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    clearChatFeed(){
        window.clearInterval(this.chatFeedInterval);
    }

    getBroadcast(){
        return new Promise((resolve, reject) => {
            this.api.liveBroadcasts.list({
                id: this.broadcastId,
                auth: this.auth,
                part: "snippet"
            }).then((data) => {
                resolve(data.data.items[0].snippet);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    getLiveChats(){
        return new Promise((resolve, reject) => {
            this.api.liveChatMessages.list({
                part: "snippet,authorDetails",
                liveChatId: this.liveChatId,
                pageToken: this.nextPageToken
            }).then((res) => {
                this.nextPageToken = res.data.nextPageToken;
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    loadLiveChats(){
        this.getLiveChats().then((chats) => {
            let chatsArray = chats.items;
            for(let i=0; i<chatsArray.length; i++){
                let chat = chatsArray[i];
                if(chat.snippet.type === "textMessageEvent"){
                    chatsArray[i] = {
                        type: "MessageChat", name: chat.authorDetails.displayName.escape(), message: chat.snippet.displayMessage.escape(), pfp: chat.authorDetails.profileImageUrl
                    };
                } if(chat.snippet.type === "superChatEvent") {
                    chatsArray[i] = {
                        type: "SuperChat", name: chat.authorDetails.displayName.escape(), message: chat.snippet.superChatDetails.userComment.escape(), pfp: chat.authorDetails.profileImageUrl, amount: chat.snippet.superChatDetails.amountDisplayString, tier: chat.snippet.superChatDetails.tier
                    };
                } if(chat.snippet.type === "superStickerEvent"){
                    chatsArray[i] = {
                        type: "SuperChat", name: chat.authorDetails.displayName.escape(), message: "", pfp: chat.authorDetails.profileImageUrl, amount: chat.snippet.superStickerDetails.amountDisplayString, tier: chat.snippet.superStickerDetails.tier
                    };
                }
                this.chats.push(chatsArray[i]);
                this.chatCallback.call(this.app, null, chatsArray[i]);
            }
        }).catch((error) => {
            this.chatCallback.call(this.app, error, null);
        });
    }

}