const fs = require('fs')

export default class AppTutorial {
    constructor(){
        document.querySelector("#helpButton").addEventListener("click", () => {this.buttonClicked()});
    }

    parseTutorialData(){
        return new Promise((resolve, reject) => {
            fs.readFile('./src/assets/tutorial.html', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  reject(err);
                }
                resolve(data);
            });
        });
    }

    async buttonClicked(){
        Swal.fire({
            html: await this.parseTutorialData(),
            grow: "row"
        });
    }
}