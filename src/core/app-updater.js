const { remote, BrowserWindow } = require('electron');
const clientService = require('../client-service');
const archiveHandler = require('../archive-handler');
const clientManager = require('../client-manager');
const stateHandler = require('./state/state-handler');

class AppUpdater {

    constructor() {
        this.windowOpen = false;
    }

    checkForUpdates() {
        setInterval(() => {
            console.log('app updater');
            const serverId = stateHandler.state.serverId;
            if (serverId !== null) {
                const server = clientManager.getClientById(serverId);
                const currentVersion = archiveHandler.getPackageJson(server.archiveName).version;
                clientService.isUpdateAvailable(server.url, currentVersion).then((updateIsAvailable) => {
                    if (updateIsAvailable) {
                        clientService.downloadNewVersionMain(server, this.reloadWindow, this.printError);
                    }
                }, error => console.error(error))
            }
        }, 3000);
    }

    printError(error) {
        console.log(error);
    }

    reloadWindow(archiveName) {
        if (process && process.type === 'renderer') {
            remote.getCurrentWindow().reload();
        } else {
            BrowserWindow.getFocusedWindow().reload();
        }
    }

}

module.exports = new AppUpdater();