class FileValidator {

    constructor() {}

    hasValidExtension(filePath) {
        const allowedExtensions = /(\.json)/;
        return allowedExtensions.exec(filePath);
    }

    hasValidContent(content) {
        const contentAsJson = JSON.parse(content);
        const isArray = Array.isArray(contentAsJson);
        if (!isArray) {
            return false;
        }
        const hasEntries = contentAsJson.length > 0;
        if (!hasEntries) {
            return false;
        }
        return contentAsJson.every((entry) => {
            return (typeof entry.id === 'number') &&
                (typeof entry.url === 'string') &&
                (typeof entry.name === 'string') &&
                (typeof entry.archiveName === 'string')
        });
    }
}

module.exports = new FileValidator();