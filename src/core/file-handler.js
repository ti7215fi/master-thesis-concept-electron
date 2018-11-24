const fs = require('fs');
const asar = require('asar');

class FileHandler {

    writeFile(path, data, options = null) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, options, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    extractFileFromAsarArchive(path, fileName) {
        return new Promise((resolve, reject) => {
            try {
                const buffer = asar.extractFile(path, fileName);
                resolve(buffer);
            } catch(error) {
                reject(error);
            }
        });
    }

}

module.exports = new FileHandler();