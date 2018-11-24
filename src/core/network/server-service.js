const path = require('path');
const fs = require('fs');
const HttpService = require('./http-service');

class Server {
    constructor(id, url, name, archiveName) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.archiveName = archiveName;
    }
}

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

    getServerById(id) {
        return this.servers.find((client) => {
            return client.id === id;
        });
    }

    /*get servers() {
        return new Promise((resolve, reject) => {
            this.httpService.get('http://127.0.0.1:3000/client-app/server-list').then((response) => {
                resolve(response.body);
            }, error => reject(error));
        });
    }*/

    get servers() {
        return [
            new Server(0, 'http://127.0.0.1:3000', 'Demo-Server', 'demo-server'),
            new Server(1, 'http://127.0.0.1:8080', 'Live-Server', 'live-server')
        ];
    }

    /*get servers() {
        const savePath = path.join(__dirname, '..', 'servers.json');
        if (fs.existsSync(savePath)) {
            return require(savePath);
        }
        return [];
    }*/

}

module.exports = new ServerService();