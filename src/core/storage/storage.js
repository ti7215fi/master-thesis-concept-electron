const { app, remote } = require('electron');
const fs = require('fs');
const path = require('path');

class Storage {

    constructor(options) {
        const pathUserData = (app || remote.app).getPath('userData');
        this.path = path.join(pathUserData, `${options.fileName}.json`);
        this.data = parseDataFile(this.path);
    }

    get(key) {
        return parseDataFile(this.path)[key];
    }

    set(key, value) {
        this.data[key] = value;
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.data));
        } catch (error) {
            console.error(error);
        };
    }

}

function parseDataFile(filePath, defaults = {}) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        console.error(error);
        return defaults;
    }
}

module.exports = Storage;