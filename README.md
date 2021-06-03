# Twidget
![Demo Picture](https://github.com/ZackyTalib/twidget/raw/master/assets/demo/DemoPic.png)

## About
Twidget is a desktop application to select and feature a Youtube Livestream Chat comment in OBS. It is used alongside OBS to select Youtube Livestream Chat  comments live and display it in OBS as the stream is happening.

#### Twidget helps streamers with:
* Creating more enganging QnA livestreams
* Responding to livestream chat comments more easily
* Make the stream more engaging and interactive

#### Built With:
* [NodeJS](https://nodejs.org/en/)
* [Electron](https://github.com/electron/electron)
* [Electron-Forge](https://github.com/electron-userland/electron-forge)
* [Express](https://github.com/expressjs/express)

## Getting Started
This section will show you how to run Twidget alongside the source code locally on your machine and how to install it as a regular user would. PS: The local setup still uses the main Twidget database and oAuth configuration - not your own.

#### Prerequisites
* [npm](https://www.npmjs.com/)
```npm install npm@latest -g```

#### Setup
1. Clone the Repo
```git clone https://github.com/ZackyTalib/twidget```
2. Install the NPM packages
```npm install```
3. Start the app
```npm start```

#### Installation
Unlike the setup section, this section will show you how to install Twidget locally as an application (Without the source code).
1. Visit the realeases section of this Github Repo
2. Download the latest release of Twidget
3. Accept any warning messages (the app has not been Code Signed yet so it triggers browser warnings)
4. Run the exe installer
5. Wait until the installer has finished installing, the app should immediately launch

## Usage
This section can also be found inside the Twidget app by clicking the help icon in the Chatbox menubar.

##### OBS Setup:
1. Open OBS and create a new browser source
![Create a new browser source](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image00.png)
2. Set the browser source URL to *localhost:3000/source*
3. Set the width to *450* and the height to *250*
4. Insert the custom css: *body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }*
![Browser source configuration](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image10.png)
5. Enable the *"Refresh browser when scene becomes active"* option
![Refresh browser when scene becomes active](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image11.png)
6. Click *OK*

##### App Usage:
1. Open Twidget and sign in if you have not
2. Open OBS and open the scene where you have set up the Twidget browser source
3. Click the *Start* button in Twidget and enter the Youtube Stream Link found in the address bar. (make sure to include the HTTPS prefix)
![Live streaming URL](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image20.png)
![Twidget connection popup](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image21.png)
4. Wait until the stream chat comments get loaded in the chatbox
5. Select the specific comments you would like to display in OBS
6. The selected comments will appear in the OBS modal, this may take a while at the beggining. If it still does not appear after one minute, refresh the scene
![Twidget OBS Source](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image30.png)
7. You can also unselect comments you have already selected
8. Scroll through the chatbox to see all the comments, Twidget updates the chatbox every 5 seconds
9. You can change the theme of the chat source that appears in OBS by clicking the settings icon in the Chatbox Menubar and choose the templates
![Twidget OBS Source](https://github.com/ZackyTalib/twidget/raw/master/src/assets/images/tutorialScreenshots/image40.png)
10. To stop the stream, press the stop button

#### FAQ

**Why is the Twidget modal not showing up in OBS?**
This is because the OBS browser source has not refreshed the Twidget page. To refresh the OBS source, switch to a different scene in OBS which does not contain the Twidget browser source, and then switch back to the scene containing the Twidget browser source. This should refresh the browser source and then the Twidget modal will show up.

**Why are the old Youtube Livestream chats not getting loaded?**
After a certain point, Youtube neglects to show the oldest messages in the chats. This only happens to very old messages in the stream though and should not be a point of concern.

**Can you load other channel's chat stream in Twidget?**
No, you can only load the chat stream of a livestream which is streamed by the Google account you logged in to Twidget with. Connecting Twidget with a stream that is not streamed by your account will result in an error.

## Contributing
Contributions are what make Twidget better and better. Any contributions you make are **greatly appreciated**

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request.

## License
Distributed under the GNU GPLv3 License. See `LICENSE` for more information.

## Contact
Zacky VT - zackvt057@gmail.com
Project Link: https://github.com/ZackyTalib/twidget

## Actknowledgements
* [EJS](https://github.com/mde/ejs)
* [electron-is-dev](https://github.com/sindresorhus/electron-is-dev)
* [electron-squirrel-startup](https://github.com/mongodb-js/electron-squirrel-startu)
* [electron-store](https://github.com/sindresorhus/electron-store)
* [Firebase](https://firebase.google.com/)
* [GoogleAPIs](https://github.com/googleapis/google-api-nodejs-client)
* [Bootstrap](https://getbootstrap.com/)
* [SweetAlert2](https://sweetalert2.github.io/)

