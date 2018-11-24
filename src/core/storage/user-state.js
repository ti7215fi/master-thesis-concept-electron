const Storage = require('./storage');

class UserState {

    get prefix() { return 'user_state' };

    constructor() {
        this.storage = new Storage({ fileName: 'user-data' });
    }

    set currentServerId(serverId) {
        this.storage.set(`${this.prefix}_current_server_id`, serverId);
    }

    get currentServerId() {
        return this.storage.get(`${this.prefix}_current_server_id`);
    }

    set activeReleaseVersion(version) {
        this.storage.set(`${this.prefix}_active_release_version`, version);
    }

    get activeReleaseVersion() {
        return this.storage.get(`${this.prefix}_active_release_version`);
    }

    clear() {
        this.currentServerId = null;
        this.activeReleaseVersion = null;
    }
 
}

module.exports = new UserState();