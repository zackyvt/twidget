var firebaseConfig = {
    apiKey: "AIzaSyBAm2dGJlw4wwn_ERLsjAXhxg9qqzZYFFg",
    authDomain: "twidgetapp.firebaseapp.com",
    databaseURL: "https://twidgetapp-default-rtdb.firebaseio.com",
    projectId: "twidgetapp",
    storageBucket: "twidgetapp.appspot.com",
    messagingSenderId: "312903507691",
    appId: "1:312903507691:web:546eee7418658589d368ae",
    measurementId: "G-HGFQ6VB56C"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

let credential = this.firebase.auth.GoogleAuthProvider.credential(document.querySelector("#credential").innerHTML);
firebase.auth().signInWithCredential(credential).then((val) => {
    console.log(val);
    listenOnData();
}).catch((error) => {
    if(error.code === "auth/invalid-credential"){
        document.querySelector(".alert").innerHTML = "An error occured! Please sign out in the Twidget app and re-sign in."
        document.querySelector(".alert").style.display = "block";
    }
    console.error(error);
});

let superchat = new Superchat();
let chat = new Chat();

superchat.setInvisible();
chat.setInvisible();

function listenOnData(){
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/data').on('value', (snapshot) => {
        console.log(snapshot.val());
        if(snapshot.val().visible){
            if(snapshot.val().type == "MessageChat"){
                superchat.setInvisible();
                chat.setChat(snapshot.val());
            } else {
                chat.setInvisible();
                superchat.setSuperchat(snapshot.val());
            }
        } else {
            superchat.setInvisible();
            chat.setInvisible();
        }
    });
}