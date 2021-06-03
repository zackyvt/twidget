export default class SourceManager {
    constructor(){
        this.currentTemplate = null;
    }

    async render(data){
        if(!data.visible){
            document.getElementsByClassName("root")[0].style.display = "none";
            return;
        }
        document.getElementsByClassName("root")[0].style.display = "block";

        await this.includeTempalate(data.template);

        if(data.type == "MessageChat"){
            document.getElementById("name").innerHTML = data.name;
            document.getElementById("pfp").src = data.pfp;
            document.getElementById("message").innerHTML = data.message;
        }

        if(data.type == "SuperChat"){
            document.getElementById("name").innerHTML = data.name;
            document.getElementById("pfp").src = data.pfp;
            document.getElementById("message").innerHTML = data.message;
            document.getElementById("amount").innerHTML = data.amount;
            for(let i=1; i<=7; i++){
                document.getElementById("container").classList.remove("tier" + i);
            }
            if(!data.message){
                document.getElementById("container").classList.add("noSuperchatContent");
            } else {
                document.getElementById("container").classList.remove("noSuperchatContent");
            }
            document.getElementById("container").classList.add("tier" + (data.tier > 7 ? 7 : data.tier));
        }
    }

    includeTempalate(template){
        return new Promise((resolve, reject) => {
            if(this.currentTemplate == template){
                resolve(true);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        document.getElementsByClassName("root")[0].innerHTML = xhr.responseText;
                        this.currentTemplate = template;
                        document.getElementById("templateCss").href = '/static/SourceTemplates/' + template + '/index.css';
                        resolve(true);
                    }
                }
                xhr.open('GET', '/static/SourceTemplates/' + template + '/index.html');
                xhr.send();
            }
        });
    }

}