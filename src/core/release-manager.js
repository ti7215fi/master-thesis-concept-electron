const path = require('path');
const remote = require('electron').remote;

const fileHandler = require('./file/file-handler');
const gitHubClient = require('./network/github-client');
const userState = require('./storage/user-state');
const utils = require('./utils');
const AppUpdater = require('./app-updater');

class ReleaseManager {

    constructor() { }

    loadRelease(releaseVersion) {
        if (releaseVersion !== userState.activeReleaseVersion) {
            isReleaseAvailable(releaseVersion).then((isAvailable) => {
                if (isAvailable) {
                    load(releaseVersion);
                } else {
                    gitHubClient.downloadReleaseByTag(`v${releaseVersion}`).then((item) => {
                        load(releaseVersion);
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

/**
 * #1 Save release version to current user state.
 * #2 Start auto updater.
 * #3 Load file to current window.
 * @param {number} releaseVersion 
 */
function load(releaseVersion) {
    const filePath = path.join(getSavePath(), `${releaseVersion}.asar`, 'index.html');
    userState.activeReleaseVersion = releaseVersion;
    AppUpdater.checkForUpdates();
    remote.getCurrentWindow().loadFile(filePath);
}

module.exports = new ReleaseManager();