const fs = require('fs')

const html = '<div class="accordion" id="accordionExample">    <div class="accordion-item">      <h2 class="accordion-header" id="headingOne">        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">          OBS Setup        </button>      </h2>      <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">        <div class="accordion-body">          <ol>              <li>Open OBS and create a new browser source</li>              <div style="display: flex; width: 90%;">                <img src="./assets/tutorialScreenshots/image00.png" style="margin-right: 5px; width: 50%;">                 <img src="./assets/tutorialScreenshots/image01.png" style="margin-left: 5px; width: 50%;">              </div>              <li>Set the browser source URL to <i>localhost:3000/source</i></li>              <li>Set the width to <i>450</i> and the height to <i>250</i></li>              <li>Insert the custom css: <i>body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }</i></li>              <img src="./assets/tutorialScreenshots/image10.png">              <li>Check the <i>"Refresh browser when scene becomes active"</i> option</li>              <img src="./assets/tutorialScreenshots/image11.png">              <li>Click <i>OK</i></li>          </ol>        </div>      </div>    </div>    <div class="accordion-item">      <h2 class="accordion-header" id="headingTwo">        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">          App Usage        </button>      </h2>      <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">        <div class="accordion-body">            <ol>                <li>Open Twidget and sign in if you have not</li>                <li>Click the <i>Start</i> button and enter the Youtube Stream Link found in the address bar. (make sure to include the HTTPS prefix)</li>                <img src="./assets/tutorialScreenshots/image20.png" style="width: 90%; margin-bottom: 5px;">                <img src="./assets/tutorialScreenshots/image21.png" style="width: 90%; margin-top: 5px;">                <li>Wait until the stream chat comments get loaded in the chatbox</li>                <li>Select the specific comments you would like to display in OBS</i></li>                <li>The selected comments will appear in the OBS modal, this may take a while at the beggining. If it still does not appear after one minute, refresh the scene</li>                <img src="./assets/tutorialScreenshots/image30.png" style="width: 90%;">                <li>You can also unselect comments you have already selected</li>                <li>Scroll through the chatbox to see all the comments, Twidget updates the chatbox every 5 seconds</li>                <li>To stop the stream, press the stop button</li>            </ol>        </div>      </div>    </div>  </div>  <style>      li {          margin-bottom: 5px;      }      ol img {          margin: 20px;          width: 90%;      }      ol {          text-align: start;      }  </style>'

export default class AppTutorial {
    constructor(){
        document.querySelector("#helpButton").addEventListener("click", () => {this.buttonClicked()});
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
    }

    async buttonClicked(){
        Swal.fire({
            html: html,
            grow: "row"
        });
    }
}