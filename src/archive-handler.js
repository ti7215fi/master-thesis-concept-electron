class ArchiveHandler {

    get path() {
        return require('path');
    }

    get asar() {
        return require('asar');
    }

    get isDev() {
        return require('electron-is-dev');
    }

    get savePath() {
        let savePath = this.path.join(__dirname, '..');
        if (this.isDev) {
            savePath = this.path.join(savePath, 'clients');
        } else {
            savePath = this.path.join(savePath, '..');
        }
        return savePath;
    }

    archiveExists(archiveName) {
        try {
            const filePath = this.path.join(this.savePath, archiveName);
            this.asar.extractFile(filePath, 'package.json');
            return true;
        } catch(error) {
            if (error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    }

    getPackageJson(archiveName) {
        const filePath = this.path.join(this.savePath, archiveName);
        const extractedFile = this.asar.extractFile(filePath, 'package.json');
        return JSON.parse(extractedFile);
    }

}

module.exports = new ArchiveHandler();