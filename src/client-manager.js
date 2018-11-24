class Server {
    constructor(id, url, name, archiveName) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.archiveName = archiveName;
    }
}

class ClientManager {

    get servers() {
        return [
            new Server(0, 'http://127.0.0.1:3000', 'Demo-Server', 'demo-server'),
            new Server(1, 'http://127.0.0.1:8080', 'Live-Server', 'live-server')
        ];
    }

    /*get servers() {
        const savePath = this.path.join(__dirname, '..', 'servers.json');
        if (this.fs.existsSync(savePath)) {
            return require(savePath);
        }
        return [];
    }*/

    constructor() {
        this.fs = require('fs');
        this.path = require('path');
    }

    getClientById(id) {
        return this.servers.find((client) => {
            return client.id === id;
        });
    }

}

module.exports = new ClientManager();