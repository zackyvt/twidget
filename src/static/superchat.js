class Superchat {
    constructor(){
        this.tierColor = [
            ["#1565c0", "", "rgb(255 255 255 / 70%)", "#ffffff"],
            ["#00b8d4", "#00e5ff", "#000000", "#000000"],
            ["#00bfa5", "#1de9b6", "#000000", "#000000"],
            ["#ffb300", "#ffca28", "#000000", "#000000"],
            ["#e65100", "#f57c00", "rgb(255 255 255 / 70%)", "#ffffff"],
            ["#c2185b", "#e91e63", "rgb(255 255 255 / 70%)", "#ffffff"],
            ["#d00000", "#e62117", "rgb(255 255 255 / 70%)", "#ffffff"]
        ];
    }

    setSuperchat(data){
        document.querySelector("#superchatContainer").style.display = "grid";
        document.querySelector(".superchatName").innerHTML = data.name;
        document.querySelector(".superchatPfp").src = data.pfp;
        document.querySelector(".superchatAmount").innerHTML = data.amount;
        document.querySelector(".superchatText").innerHTML = data.message;

        let tierCalc = data.tier > 7 ? 6 : data.tier-1

        document.querySelector("#superchatContainer").style.backgroundColor = this.tierColor[tierCalc][0];
        document.querySelector(".superchatContent").style.backgroundColor = this.tierColor[tierCalc][1];
        document.querySelector(".superchatName").style.color = this.tierColor[tierCalc][2];
        document.querySelector(".superchatAmount").style.color = this.tierColor[tierCalc][3];
        document.querySelector(".superchatText").style.color = this.tierColor[tierCalc][3];

        if(this.tierColor[tierCalc][1] == "" || !data.message){
            document.querySelector(".superchatContent").style.display = "none";
        } else {
            document.querySelector(".superchatContent").style.display = "block";
        }
    }

    setInvisible(){
        document.querySelector("#superchatContainer").style.display = "none";
    }
}