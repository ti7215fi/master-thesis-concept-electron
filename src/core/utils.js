const { app, remote } = require('electron');

class Utils {

    constructor() {}

    get userDataPath() {
        return (app || remote.app).getPath('userData');
    }

}

module.exports = new Utils();