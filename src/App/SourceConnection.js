export default class SourceConnection {
    constructor(firebase){
        this.firebase = firebase;
    }

    initializeSourceConnection(){
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').on('value', (snapshot) => {
            console.log(snapshot.val());
        });
    }

    setChat(chatData){
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set(chatData);
    }

    setInvisible(){
        this.firebase.database().ref('users/' + this.firebase.auth().currentUser.uid + '/data').set({visible: false});
    }
}