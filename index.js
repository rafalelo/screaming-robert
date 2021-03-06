'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
/// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');


const isDev = require('electron-is-dev');
require('v8-compile-cache');



unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.garage-makezone.screaming-robert');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;

let env = process.env.NODE_ENV || 'development'

const createMainWindow = async () => {
    const win = new BrowserWindow({
        title: "Robert",
        show: false,
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    });

    win.on('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        // Dereference the window
        // For multiple windows store them in an array
        mainWindow = undefined;
    });

    console.log(process.env.NODE_ENV)

    // TODO: uncomment when ready to publish, only for development purposes needed
    //win.setResizable(false);


    await win.loadFile(path.join(__dirname, 'index.html'));

    return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }

        mainWindow.show();
    }
});

app.on('window-all-closed', () => {
    if (!is.macos) {
        app.quit();
    }
});

app.on('activate', async () => {
    if (!mainWindow) {
        mainWindow = await createMainWindow();
    }
});

(async () => {
	await app.whenReady();
    mainWindow = await createMainWindow();
    
	//const favoriteAnimal = config.get('favoriteAnimal');
	//mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
})();


