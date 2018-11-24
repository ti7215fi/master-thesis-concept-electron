const fs = require('fs');
const path = require('path');
const utils = require('./../utils');

class Storage {

    constructor(options) {
        this.path = path.join(utils.userDataPath, `${options.fileName}.json`);
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