const releaseManager = require('./release-manager');
const userState = require('./storage/user-state');
const serverService = require('./network/server-service');

class AppUpdater {

    constructor() {}

    checkForUpdates() {
        setInterval(() => {
            const serverId = userState.currentServerId;
            if (serverId !== null && serverId !== undefined) {
                const server = serverService.getServerById(serverId);
                serverService.getAppVersion(server.url).then((releaseVersion) => {
                    releaseManager.loadRelease(releaseVersion);
                }, error => console.error(error));
            }
        }, 3000);
    }

}

module.exports = new AppUpdater();