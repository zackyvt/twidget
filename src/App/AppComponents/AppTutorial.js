const fs = require('fs')

export default class AppTutorial {
    constructor(){
        document.querySelector("#helpButton").addEventListener("click", () => {this.buttonClicked()});
        /*this.tutorial = [
            {heading: "OBS Setup (only once)"},
            {text: "Open OBS and create a new browser source"},
            {image: "./assets/tutorialScreenshots/image00.png"},
            {image: "./assets/tutorialScreenshots/image01.png"},
            {text: "Set the browser source URL to <i>localhost:3000/source</i>"},
            {text: "Set the width to <i>450</i> and the height to <i>250</i>"},
            {text: "Insert the custom css: <i>body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }</i>"},
            {image: "./assets/tutorialScreenshots/image10.png"},
            {text: "Check the <i>\"Refresh browser when scene becomes active\"</i> option"},
            {image: "./assets/tutorialScreenshots/image11.png"},
            {text: "Click <i>OK</i>"},
            {image: "./assets/tutorialScreenshots/image12.png"},
            {heading: "Twidget Tutorial"},
            {text: "Open Twidget and sign in if you have not"},
            {text: "Click the <i>Start</i> button and enter the Youtube Stream Link found in the address bar. (make sure to include the HTTPS prefix)"},
            {text: "Wait until the stream chat comments get loaded in the chatbox."},
            {text: "Select the specific comments you would like to display in OBS."},
            {text: "The selected comments will appear in the OBS modal, this may take a while at the beggining. If it still does not appear after one minute, refresh the scene"},
            {text: "You can also unselect comments you have already selected."},
            {text: "Scroll through the chatbox to see all the comments, Twidget updates the comments every 5 seconds."},
            {text: "To stop the stream, press the stop button."}
        ]*/
    }

    parseTutorialData(){
        return new Promise((resolve, reject) => {
            fs.readFile('./src/assets/tutorial.html', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  reject(err);
                }
                resolve(data);
            });
        });
        /*let html = "";
        for(let i=0; i<this.tutorial.length; i++){
            if(this.tutorial[i].heading){
                html += "<h2>" + this.tutorial[i].heading + "</h2>";
            } if(this.tutorial[i].image){
                //html += "<img src='" + this.tutorial[i].image + "' style='width: 300px;' />";
            } if(this.tutorial[i].text) {
                html += "<p>" + this.tutorial[i].text + "</p>";
            }
        }
        return html;*/
    }

    async buttonClicked(){
        Swal.fire({
            html: await this.parseTutorialData(),
            grow: "row"
        });
    }
}