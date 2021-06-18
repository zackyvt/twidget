const {google} = require('googleapis');
const axios = require('axios');

import ChatTest from "./ChatTest.js";

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
        this.chatOn = false;
    }

    initializeChatFeed(){
        return new Promise((resolve, reject) => {
            this.getBroadcast().then((broadcast) => {
                this.chatOn = true;
                this.liveChatId = broadcast.liveChatId;
                this.app.chatBox.displayLoading();
                this.loadLiveChats(true);
                this.chatFeedInterval = window.setInterval(() => {}, 10000);
                //this.chatFeedInterval = window.setInterval(() => {this.loadLiveChats();}, 5000);
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    clearChatFeed(){
        window.clearInterval(this.chatFeedInterval);
        this.chatOn = false;
    }

    getBroadcast(){
        return new Promise((resolve, reject) => {
            /*this.api.liveBroadcasts.list({
                id: this.broadcastId,
                auth: this.auth,
                part: "snippet"
            }).then((data) => {
                resolve(data.data.items[0].snippet);
            }).catch((error) => {
                reject(error);
            });*/
            resolve("-");
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

    getLiveChatsServer(){
        return new Promise((resolve, reject) => {
            console.log("livechats");
            axios.post("https://us-central1-twidgetapp.cloudfunctions.net/getChats", {
                liveChatID: this.broadcastId,
                pageToken: this.nextPageToken ? this.nextPageToken : "none"
            }).then(res => {
                console.log(res);
                this.nextPageToken = res.data.data.nextPageToken;
                resolve(res.data.data);
            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    }

    loadLiveChats(first){
        this.getLiveChatsServer().then((chats) => {
            if(!this.chatOn){
                return;
            }

            if(first){
                this.app.chatBox.hideLoading();
            }

            console.log("gotChat");
            let chatsArray = chats.items;

            chatsArrayLoop:
            for(let i=0; i<chatsArray.length; i++){
                let chat = chatsArray[i];
                switch(chat.snippet.type){
                    case "textMessageEvent":
                        chatsArray[i] = {
                            type: "MessageChat", name: chat.authorDetails.displayName.escape(), message: chat.snippet.displayMessage.escape(), pfp: chat.authorDetails.profileImageUrl, template: this.app.appSettings.settingTemplates.MessageChat
                        };
                        chatsArray[i].userStatus = chat.authorDetails.isChatOwner ? "owner" : (chat.authorDetails.isChatModerator ? "moderator" : "normal");
                        break;
                    case "superChatEvent":
                        chatsArray[i] = {
                            type: "SuperChat", name: chat.authorDetails.displayName.escape(), message: chat.snippet.superChatDetails.userComment.escape(), pfp: chat.authorDetails.profileImageUrl, amount: chat.snippet.superChatDetails.amountDisplayString, tier: chat.snippet.superChatDetails.tier, template: this.app.appSettings.settingTemplates.SuperChat
                        };
                        break;
                    case "superStickerEvent":
                        chatsArray[i] = {
                            type: "SuperChat", name: chat.authorDetails.displayName.escape(), message: "", pfp: chat.authorDetails.profileImageUrl, amount: chat.snippet.superStickerDetails.amountDisplayString, tier: chat.snippet.superStickerDetails.tier, template: this.app.appSettings.settingTemplates.SuperSticker
                        };
                        break;
                    default:
                        continue chatsArrayLoop;
                }

                this.chats.push(chatsArray[i]);
                this.chatCallback.call(this.app, null, chatsArray[i]);
            }

            window.setTimeout(() => {this.loadLiveChats(false)}, 1000);
        }).catch((error) => {
            this.chatCallback.call(this.app, error, null);
        });
    }

}