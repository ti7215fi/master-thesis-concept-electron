const electronDl = require('electron-dl');
const isDev = require('electron-is-dev');
const { remote, BrowserWindow } = require('electron');
const path = require('path');

class ClientService {

    get requestService() {
        return require('request');
    }

    get ipcRenderer() {
        return require('electron').ipcRenderer;
    }

    constructor() { }

    isUpdateAvailable(url, currentVersion) {
        return new Promise((resolve, reject) => {
            const requestBody = { version: currentVersion };
            this.requestService.post(`${url}/client-app/update-available`, requestBody, (error, response, body) => {
                if (!error) {
                    resolve(body)
                } else {
                    reject(error);
                }
            });
        });
    }

    downloadNewVersion(client, successCallBack, errorCallback) {
        this.ipcRenderer.send('download-client', { url: client.url, fileName: client.archiveName });
        this.ipcRenderer.once('download-client-success', (event, fileName) => {
            successCallBack(fileName);
        });
        this.ipcRenderer.once('download-client-error', (event, error) => {
            errorCallback(error);
        });
    }

    downloadNewVersionMain(server, successCallBack, errorCallback) {
        let window = (process && process.type === 'renderer') ? remote.getCurrentWindow() : BrowserWindow.getFocusedWindow();
        electronDl.download(window, `${server.url}/client-app/download`, {
            directory: isDev ? path.join(__dirname, 'clients') : path.join(__dirname, '..'),
            filename: `${server.archiveName}.asar`
          }).then(downloadItem => {
            successCallBack(server.archiveName);
          }).catch((error) => {
            errorCallback(error);
          });
    }

    get servers() {
        return new Promise((resolve, reject) => {
            this.requestService.get('http://127.0.0.1:3000/client-app/server-list', null, (error, response, body) => {
                if(!error) {
                    resolve(JSON.parse(body));
                } else {
                    reject(error);
                }
            });
        });
    }

}

module.exports = new ClientService();