const HttpService = require('./http-service');

class ServerService {

    constructor() {
        this.httpService = new HttpService();
    }

    getAppVersion(serverUrl) {
        return new Promise((resolve, reject) => {
            this.httpService.get(`${serverUrl}/client-app/version`, {}, false).then((response) => {
                resolve(response.body);
            }, error => reject(error));
        });
    }

}

module.exports = new ServerService();