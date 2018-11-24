const path = require('path');
const isDev = require('electron-is-dev');
const fileHandler = require('./file-handler');
const remote = require('electron').remote;
const gitHubClient = require('./../network/github-client');
const userState = require('./storage/user-state');

class ReleaseManager {

    constructor() { }

    get savePath() {
        let savePath = path.join(__dirname, '../..');
        if (isDev) {
            savePath = path.join(savePath, 'releases');
        } else {
            savePath = path.join(savePath, '..', 'releases');
        }
        return savePath;
    }

    isReleaseAvailable(releaseVersion) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.savePath, `${releaseVersion}.asar`);
            fileHandler.extractFileFromAsarArchive(filePath, 'index.html').then((buffer) => {
                resolve(true);
            }, error => {
                if (error.code === 'ENOENT') {
                    resolve(false);
                }
                reject(error);
            });
        });
    }

    loadRelease(releaseVersion) {
        if (releaseVersion !== userState.activeReleaseVersion) {
            this.isReleaseAvailable(releaseVersion).then((isAvailable) => {
                if (isAvailable) {
                    this.loadIndexHtmlToCurrentWindow(releaseVersion);
                } else {
                    gitHubClient.downloadReleaseByTag(`v${releaseVersion}`).then((item) => {
                        this.loadIndexHtmlToCurrentWindow(releaseVersion);
                    }, error => console.error(error));
                }
            }, error => console.error(error));
        }
    }

    loadIndexHtmlToCurrentWindow(releaseVersion) {
        const filePath = path.join(this.savePath, `${releaseVersion}.asar`, 'index.html');
        userState.activeReleaseVersion = releaseVersion;
        remote.getCurrentWindow().loadFile(filePath);
    }

}

module.exports = new ReleaseManager();