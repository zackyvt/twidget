import SourceManager from "/static/SourceTemplates/SourceManager.js";

var socket = io();

const sourceManager = new SourceManager();

socket.on('displayLabel', (data) => {
    document.getElementsByClassName("readyMessage")[0].style.display = "block";
});

socket.on('newChat', (data) => {
    console.log(data);
    document.getElementsByClassName("readyMessage")[0].style.display = "none";
    sourceManager.render(data);
});