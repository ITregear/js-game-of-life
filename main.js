const { app, BrowserWindow } = require('electron');


function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 675,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // and load the index.html of the app.
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);
