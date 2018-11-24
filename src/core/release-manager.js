const path = require('path');
const fileHandler = require('./file/file-handler');
const { app, remote } = require('electron');
const gitHubClient = require('./network/github-client');
const userState = require('./storage/user-state');
const utils = require('./utils');

class ReleaseManager {

    constructor() { }

    loadRelease(releaseVersion) {
        if (releaseVersion !== userState.activeReleaseVersion) {
            isReleaseAvailable(releaseVersion).then((isAvailable) => {
                if (isAvailable) {
                    loadIndexHtmlToCurrentWindow(releaseVersion);
                } else {
                    gitHubClient.downloadReleaseByTag(`v${releaseVersion}`).then((item) => {
                        loadIndexHtmlToCurrentWindow(releaseVersion);
                    }, error => console.error(error));
                }
            }, error => console.error(error));
        }
    }
}

function getSavePath() {
    return utils.userDataPath;
}

function isReleaseAvailable(releaseVersion) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(getSavePath(), `${releaseVersion}.asar`);
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

function loadIndexHtmlToCurrentWindow(releaseVersion) {
    const filePath = path.join(getSavePath(), `${releaseVersion}.asar`, 'index.html');
    userState.activeReleaseVersion = releaseVersion;
    remote.getCurrentWindow().loadFile(filePath);
}

module.exports = new ReleaseManager();