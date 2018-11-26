const releaseManager = require('./release-manager');
const userState = require('./storage/user-state');
const serverService = require('./network/server-service');
const CronJob = require('cron').CronJob;

class AppUpdater {

    constructor() {
        this.job = new CronJob('0 */10 * * * *', this.onTick, this.onComplete);
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

    onComplete() {
        console.log('job complete');
    }

    checkForUpdates() {
        this.job.start();
    }

    stop() {
        this.job.stop();
    }

}

module.exports = new AppUpdater();