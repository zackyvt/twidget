import app from "../App.js"

export default class StreamButton {
    constructor(startCall, stopCall){
        this.button = document.querySelector("#streamButton");
        this.buttonState = "start";
        this.buttonCallback = {
            "start": startCall,
            "stop": stopCall
        }
        this.button.addEventListener("click", (e) => {
            this.buttonClicked();
        });
    }

    setButton(classRemove, classAdd, innerText){
        this.button.classList.remove(classRemove);
        this.button.classList.add(classAdd);
        this.button.innerHTML = innerText;
    }

    buttonClicked(){
        if(this.buttonState == "wait"){return;}
        this.setButton(this.buttonState=="start" ? "btn-success" : "btn-danger", "btn-warning", "Wait");
        let trueButtonState = this.buttonState;
        this.buttonState = "wait";
        this.buttonCallback[trueButtonState].call(app).then((success) => {
            if(success){
                this.buttonState = (trueButtonState=="start" ? "stop" : "start");
                this.button.classList.remove("btn-warning");
                this.setButton(trueButtonState=="start" ? "btn-success" : "btn-danger", trueButtonState=="stop" ? "btn-success" : "btn-danger", trueButtonState=="stop" ? "Start" : "Stop");
            } else {
                this.buttonState = trueButtonState;
                this.setButton("btn-warning", trueButtonState=="start" ? "btn-success" : "btn-danger", trueButtonState.charAt(0).toUpperCase() + trueButtonState.slice(1));
            }
        });
    }

}