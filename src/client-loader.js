class ClientLoader {

    get clientService() {
        return require('./client-service');
    }

    get archiveHandler() {
        return require('./archive-handler');
    }

    loadClient(client) {
        if (this.archiveHandler.archiveExists(`${client.archiveName}.asar`)) {
            const packageJson = this.archiveHandler.getPackageJson(`${client.archiveName}.asar`);
            this.clientService.isUpdateAvailable(client.url, packageJson.version).then((updateIsAvailable) => {
                if (updateIsAvailable) {
                    this.clientService.downloadNewVersion(client, this.loadFile, this.printError)
                } else {
                    this.loadFile(client.archiveName);
                }
            }, this.printError);
        } else {
            this.clientService.downloadNewVersion(client, this.loadFile, this.printError)
        }
    }

    loadFile(archiveName) {
        const path = require('path');
        const archiveHandler = require('./archive-handler');
        const remote = require('electron').remote;
        const filePath = path.join(archiveHandler.savePath, `${archiveName}.asar`, 'index.html');
        remote.getCurrentWindow().loadFile(filePath);
    }

    printError(error) {
        console.error(error);
    }

}

module.exports = new ClientLoader();