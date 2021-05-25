export default class ChatTest {
    static createMessageChat(name, pfp, message){
        return {
            "snippet": {
              "hasDisplayContent": true,
              "type": "textMessageEvent",
              "displayMessage": message
            },
            "authorDetails": {
              "isChatSponsor": false,
              "isChatModerator": false,
              "isChatOwner": false,
              "displayName": name,
              "profileImageUrl": pfp
            }
          };
    }

    static createSuperChat(name, pfp, message, amount, tier){
        return {
            "snippet": {
              "hasDisplayContent": true,
              "type": "superChatEvent",
              "displayMessage": "Superchat: " + message,
              "superChatDetails": {
                "userComment": message,
                "amountDisplayString": amount,
                "tier": tier
              }
            },
            "authorDetails": {
              "isChatSponsor": false,
              "isChatModerator": false,
              "isChatOwner": false,
              "displayName": name,
              "profileImageUrl": pfp
            }
          };
    }

    static createSuperSticker(name, pfp, amount, tier){
        return {
            "snippet": {
              "hasDisplayContent": true,
              "type": "superStickerEvent",
              "displayMessage": "Super Sticker",
              "superStickerDetails": {
                "amountDisplayString": amount,
                "tier": tier
              }
            },
            "authorDetails": {
              "isChatSponsor": false,
              "isChatModerator": false,
              "isChatOwner": false,
              "displayName": name,
              "profileImageUrl": pfp
            }
          };
    }

    static createEvent(eventName){
        return {
            "snippet": {
              "type": eventName
            }
          };
    }

    static dataFields(){
        return {
            "name": "Zacky VT",
            "pfp": "https://yt3.ggpht.com/yti/ANoDKi42s1_r8lKyjNm3hdBq3rBZDn6FwnINks0tGJnM2Q=s88-c-k-c0x00ffffff-no-rj-mo",
            "message": "This is a test message.",
            "longMessage": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu",
            "amount": "$19.99",
            "tier": 3
        }
    }
}