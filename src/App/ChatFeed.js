const {google} = require('googleapis');
const axios = require('axios');

import ChatTest from "./ChatTest.js";
import Processor from "./Processor.js";

import Facebook from "./Facebook.js"

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
    constructor(auth, links, facebook, chatCallback, app){
        this.youtubeStatus = false;
        this.facebookStatus = false;
        this.facebook = facebook;

        this.broadcastId;
        this.facebookId;

        if(links.youtubeUrl){
            this.youtubeStatus = true;
            this.broadcastId = links.youtubeUrl;
        } if(links.facebookUrl){
            this.facebookStatus = true;
            this.facebookId = links.facebookUrl;
        }

        this.auth = auth;
        this.api = google.youtube({version: "v3", auth: this.auth.oauth2Client});
        this.nextPageToken;
        this.chatCallback = chatCallback;
        this.app = app;
        this.chatFeedInterval;
        this.chats = [];
        this.chatOn = false;
        this.processor;
    }

    initializeChatFeed(){
        return new Promise((resolve, reject) => {
            this.getBroadcast().then((broadcast) => {
                this.chatOn = true;
                this.app.chatBox.displayLoading();
                this.chatFeedInterval = window.setInterval(() => {}, 10000);
                if(this.youtubeStatus){
                    this.loadLiveChats(true);
                } 
                if(this.facebookStatus){
                    this.setupFacebook();
                }
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    setupFacebook(){
        this.facebook.getAccessToken((token) => {
            if(!this.youtubeStatus){
                this.app.chatBox.hideLoading();
            }
            this.facebook.loadChats(this.facebookId, (chats) => {
                this.processFacebookChat(this.facebook.parseFacebookChat(chats));
            });
        }); 
    }

    clearChatFeed(){
        window.clearInterval(this.chatFeedInterval);
        this.chatOn = false;
        if(this.processor){
            this.processor.endProcess();
            this.processor = null;
        }
    }

    getBroadcast(){
        return new Promise((resolve, reject) => {
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
            this.auth.analytics.logEvent('serverLoadEnd');
            this.processLiveChats(chats, first);

            this.processor = new Processor((chats, first) => {this.processLiveChats(chats, false);});
            this.processor.runProcessor(this.broadcastId);
        }).catch((error) => {
            this.chatCallback.call(this.app, error, null);
        });
    }

    processLiveChats(chats, first){
        if(!this.chatOn){
            return;
        }

        if(first){
            this.app.chatBox.hideLoading();
        }

        let chatsArray = chats.items;

        chatsArrayLoop:
        for(let i=0; i<chatsArray.length; i++){
            let chat = chatsArray[i];
            switch(chat.snippet.type){
                case "textMessageEvent":
                    chatsArray[i] = {
                        type: "MessageChat", name: chat.authorDetails.displayName.escape(), message: chat.snippet.displayMessage.escape(), pfp: chat.authorDetails.profileImageUrl, template: this.app.appSettings.settingTemplates.MessageChat, platform: "youtube"
                    };
                    chatsArray[i].userStatus = chat.authorDetails.isChatOwner ? "owner" : (chat.authorDetails.isChatModerator ? "moderator" : "normal");
                    this.auth.analytics.logEvent('chatLoad', {type: "MessageChat", userStatus: chatsArray[i].userStatus});
                    break;
                case "superChatEvent":
                    chatsArray[i] = {
                        type: "SuperChat", name: chat.authorDetails.displayName.escape(), message: chat.snippet.superChatDetails.userComment.escape(), pfp: chat.authorDetails.profileImageUrl, amount: chat.snippet.superChatDetails.amountDisplayString, tier: chat.snippet.superChatDetails.tier, template: this.app.appSettings.settingTemplates.SuperChat
                    };
                    this.auth.analytics.logEvent('chatLoad', {type: "SuperChat", tier: chatsArray[i].tier});
                    break;
                case "superStickerEvent":
                    chatsArray[i] = {
                        type: "SuperChat", name: chat.authorDetails.displayName.escape(), message: "", pfp: chat.authorDetails.profileImageUrl, amount: chat.snippet.superStickerDetails.amountDisplayString, tier: chat.snippet.superStickerDetails.tier, template: this.app.appSettings.settingTemplates.SuperSticker
                    };
                    this.auth.analytics.logEvent('chatLoad', {type: "SuperSticker", tier: chatsArray[i].tier});
                    break;
                default:
                    continue chatsArrayLoop;
            }

            this.chats.push(chatsArray[i]);
            this.chatCallback.call(this.app, null, chatsArray[i]);
        }
    }

    processFacebookChat(facebookChatRaw){
        if(!this.chatOn){
            return;
        }

        this.auth.analytics.logEvent('chatLoad', {type: "MessageChat", userStatus: "normal", platform: "facebook"});
        let facebookChat = facebookChatRaw;
        facebookChat.template = this.app.appSettings.settingTemplates.MessageChat;
        console.log(facebookChat);
        this.chats.push(facebookChat);
        this.chatCallback.call(this.app, null, facebookChat);
    }

}