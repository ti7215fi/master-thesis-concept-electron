const releaseManager = require('./release-manager');
const userState = require('./storage/user-state');
const serverService = require('./network/server-service');
const ScheduledTask = require('./scheduled-task');

class AppUpdater {

    constructor() {
        this.job = new ScheduledTask('0 */10 * * * *', this.onTick);
    }

    onTick() {
        const serverId = userState.currentServerId;
        if (serverId !== null && serverId !== undefined) {
            const server = serverService.getServerById(serverId);
            serverService.getAppVersion(server.url).then((releaseVersion) => {
                releaseManager.loadRelease(releaseVersion);
            }, error => console.error(error));
        }
    }

    checkForUpdates() {
        this.job.start();
    }

    stop() {
        this.job.stop();
    }

}

module.exports = new AppUpdater();