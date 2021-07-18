import app from "./dock.js"

export default class ChatButton {
    constructor(id, selectedCall, unselectedCall){
        this.id = id;
        this.button = document.querySelector("#chat"+this.id+" button");
        this.buttonState = "select";
        this.selectedCall = selectedCall;
        this.unselectedCall = unselectedCall;
        this.button.addEventListener("click", () => {this.buttonClicked();})
        this.stateSelect();
    }

    setButton(classRemove, classAdd, innerText){
        this.button.classList.remove(classRemove);
        this.button.classList.add(classAdd);
        this.button.innerHTML = innerText;
    }

    buttonClicked(){
        if(this.buttonState == "select"){
            this.buttonState = "unselect";
            this.setButton("btn-success", "btn-danger", "Unselect");
            this.selectedCall.call(app.chatBox, this.id);
        }
        else if(this.buttonState == "unselect"){
            this.buttonState = "select";
            this.setButton("btn-danger", "btn-success", "Select");
            this.unselectedCall.call(app.chatBox, this.id);
        }
    }

    stateSelect(){
        this.buttonState = "select";
        this.setButton("btn-danger", "btn-success", "Select");
    }
}