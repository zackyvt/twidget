export default class AutoScroll {
    constructor(){
       this.chatBox = document.getElementById("chatBox"); 
    }

    scrollArrow(){
        window.setInterval(() => {
            if(!this.atBottom()){
                console.log("here");
                document.getElementById("scrollArrow").style.display = "block";
            } else {
                document.getElementById("scrollArrow").style.display = "none";
            }
           }, 100);

        document.getElementById("scrollArrow").addEventListener("click", () => {
            this.autoScroll();
        });
    }

    autoScroll(){
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    atBottom() {
        let ele = this.chatBox;
        var sh = ele.scrollHeight;
        var st = ele.scrollTop;
        var ht = ele.offsetHeight;
        if(ht==0) {
            return true;
        }
        if(st == sh - ht)
            {return true;} 
        else 
            {return false;}
    }
}