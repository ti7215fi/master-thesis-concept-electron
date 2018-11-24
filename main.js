const { app, BrowserWindow, ipcMain } = require('electron');
const electronDl = require('electron-dl');
const path = require("path");
const isDev = require('electron-is-dev');
const AppUpdater = require('./src/core/app-updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// AppUpdater.checkForUpdates();

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  if (isDev) {
    win.loadFile('releases/develop/client/src/index.html');
  } else {
    win.loadFile('index.html');
  }

  // win.loadFile('index.html');

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('download-client', (event, args) => {
  electronDl.download(BrowserWindow.getFocusedWindow(), `${args.url}/client-app/download`, {
    directory: isDev ? path.join(__dirname, 'clients') : path.join(__dirname, '..'),
    filename: `${args.fileName}.asar`
  }).then(downloadItem => {
    event.sender.send('download-client-success', args.fileName);
  }).catch((error) => {
    event.sender.send('download-client-error', error);
  });
});

ipcMain.on('update-is-available', (event, args) => {
  
});

ipcMain.on('download-release', (event, args) => {
  const options = {
    directory: args.dir,
    filename: args.fileName,
  };
  electronDl.download(BrowserWindow.getFocusedWindow(), args.url, options)
    .then(item => event.sender.send('download-release-success', item))
    .catch(error => event.sender.send('download-release-error', error));
});