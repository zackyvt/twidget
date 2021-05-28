class Chat {
    setChat(data){
        document.querySelector("#chatMessageContainer").style.display = "block";
        document.querySelector("#name").innerHTML = data.name;
        document.querySelector("#pfp").src = data.pfp;
        document.querySelector("#chatMessage").innerHTML = data.message;
    
        switch(data.userStatus){
            case "moderator":
                document.querySelector(".pfp-circle").classList.remove("owner");
                document.querySelector(".pfp-circle").classList.add("moderator");
                document.querySelector(".nameIcon").src = "/static/mod-icon.png";
                break;
            case "owner":
                document.querySelector(".pfp-circle").classList.remove("moderator");
                document.querySelector(".pfp-circle").classList.add("owner");
                document.querySelector(".nameIcon").src = "/static/star.png";
                break;
            default: 
                document.querySelector(".pfp-circle").classList.remove("moderator");
                document.querySelector(".pfp-circle").classList.remove("owner");
                document.querySelector(".nameIcon").src = "";
        }
    }

    setInvisible(){
        document.querySelector("#chatMessageContainer").style.display = "none";
    }
}