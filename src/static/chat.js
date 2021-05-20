class Chat {
    setChat(data){
        document.querySelector("#chatMessageContainer").style.display = "block";
        document.querySelector("#name").innerHTML = data.name;
        document.querySelector("#pfp").src = data.pfp;
        document.querySelector("#chatMessage").innerHTML = data.message;
    }

    setInvisible(){
        document.querySelector("#chatMessageContainer").style.display = "none";
    }
}