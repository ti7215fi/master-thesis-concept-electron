const path = require('path');
const isDev = require('electron-is-dev');
const asar = require('asar');

class VersionManager {

    constructor() {}

    get savePath() {
        let savePath = path.join(__dirname, '..', '..');
        if (isDev) {
            savePath = path.join(savePath, 'versions');
        } else {
            savePath = path.join(savePath, '..', '..');
        }
        return savePath;
    }

    isVersionAvailable(version) {
        try {
            const filePath = path.join(this.savePath, version);
            asar.extractFile(filePath, 'package.json');
            return true;
        } catch(error) {
            if (error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    }
}

module.exports = new VersionManager();