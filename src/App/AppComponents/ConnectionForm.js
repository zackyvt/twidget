const fs = require('fs');
const path = require('path');

const html = '<h2 class="streamConnectionLabel swal2-title">Stream Connection</h2><div class="streamTab" id="youtubeTab">    <../../src/public/static/images/youtube.png">    <input class="swal2-input" placeholder="Enter Youtube URL..." name="youtubeInput"></div><div class="streamTab" id="facebookTab">    <img src="../../src/public/static/images/facebook.png">    <input class="swal2-input" placeholder="Enter Facebook URL..." style="display: none;">    <div class="connectWithFacebook">        <img src="../../src/public/static/images/facebook.png">        <p>Connect to Facebook</p>    </div></div><button class="swal2-confirm swal2-styled connection-buttons" id="connectButtonOk">Connect</button><style>    .streamTab {        display: flex;        justify-content: center;    }    .streamTab > img {        padding: 5px;        width: 2em;        height: 2em;        margin: 0.5em auto;        border-radius: 100%;        margin-right: 10px;    }    .streamTab input {        margin: 0.5em auto;        height: 2em;        font-size: 1em;    }    .connection-buttons {        margin-top: 20px;    }    .connectWithFacebook {        margin-top: 10px;        padding: 3px 20px;        display: flex;        background-color: #3b5998;        align-content: center;        color: white;        border-radius: 10px;        cursor: pointer;        width: 100%;        margin-bottom: 20px;        justify-content: center;    }    .connectWithFacebook:hover {        opacity: 0.9;    }    .connectWithFacebook img {        width: 30px;        height: 30px;        margin-right: 10px;    }        .connectWithFacebook p {        margin: 0;        height: fit-content;        align-self: center;        font-size: 0.8em;        opacity: 0.75;        margin-right: 20px;        font-weight: bold;    }</style>';

function fixPathForAsarUnpack(path){
    return path.replace("app.asar", "app.asar.unpacked");
}

export default class ConnectionForm {
    constructor(facebook, auth){
        this.auth = auth;
        this.facebook = facebook;
    }

    async showPopup(callback){
        Swal.fire({
            html: await this.parseHTMLFile(),
            showConfirmButton: false,
            showCloseButton: true
        }).then((value) => {
            if(value.isDismissed){
                if(value.dismiss){
                    callback(false);
                }
            }
        });

        this.facebook.getAccessToken(() => {
            document.querySelector(".connectWithFacebook").style.display = "none";
            document.querySelector("#facebookTab input").style.display = "flex";
        });

        document.getElementById("connectButtonOk").addEventListener('click', () => {
            let youtubeValue = document.querySelector("#youtubeTab input").value;
            let facebookValue = document.querySelector("#facebookTab input").value;
            let twitchValue = document.querySelector("#twitchTab input").value;

            if(!this.validURL(youtubeValue) && !this.validURL(facebookValue) && !this.validURL(twitchValue)){
                document.querySelector("#youtubeTab input").classList.add("swal2-inputerror");
                document.querySelector("#facebookTab input").classList.add("swal2-inputerror");
            } else {
                Swal.close();
                callback(true, {
                    youtubeUrl: this.parseYoutubeLink(youtubeValue),
                    facebookUrl: this.parseFacebookLink(facebookValue),
                    twitchUrl: this.parseTwitchLink(twitchValue)
                });
            }
        });

        document.querySelector(".connectWithFacebook").addEventListener('click', () => {
            this.facebook.signIn();
        });
    }

    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    parseHTMLFile(){
        return new Promise((resolve, reject) => {
            fs.readFile(fixPathForAsarUnpack(path.join(__dirname, '../assets/templates/connectionForm.html')), 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  reject(err);
                }
                resolve(data);
            });
        });
    }

    parseFacebookLink(link){
        if(!link){
            return link;
        }
        return link.split("/")[5];
    }

    parseYoutubeLink(link){
        if(!link){
            return link;
        }
        let res = link;
        res = link.split("/");
        res.splice(0,2);
        switch(res[0]){
            case "studio.youtube.com":
              this.auth.analytics.logEvent('link_parse', {option: "studio.youtube.com"});
              return res[2];
              break;
          case "youtu.be":
              this.auth.analytics.logEvent('link_parse', {option: "youtu.be"});
              return res[1];
              break;
          case "www.youtube.com":
              this.auth.analytics.logEvent('link_parse', {option: "www.youtube.com"});
              return res[1].split("=")[1].split("&")[0];
              break;
        }
    }

    parseTwitchLink(link){
        if(!link){
            return link;
        }

        return link.split(".tv/")[1];
    }

}