const HttpService = require('./http-service');
const fileHandler = require('../core/file-handler');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;

class GitHubClient {

    get repoName() {
        return 'master-thesis-concept';
    }

    get userName() {
        return 'ti7215fi';
    }

    get urlToRepo() {
        return `${this.httpService.url}/repos/${this.userName}/${this.repoName}`;
    }

    constructor() {
        this.httpService = new HttpService('https', 'api.github.com');
    }

    downloadReleaseByTag(tag) {
        let options = {
            headers: {
                'User-Agent': 'request module',
            },
        };

        return new Promise((resolve, reject) => {
            this.httpService.get(`${this.urlToRepo}/releases/tags/${tag}`, options).then((response) => {
                const assets = response.body.assets;
                if (assets && assets.length === 1 && (new RegExp(/.*\.asar/)).test(assets[0].name)) {
                    const asset = assets[0];
                    ipcRenderer.send('download-release', {
                        url: asset.browser_download_url,
                        dir: path.join(__dirname, '../../releases'),
                        fileName: asset.name,
                    });
                    ipcRenderer.once('download-release-success', (event, item) => resolve());
                    ipcRenderer.once('download-release-error', (event, error) => reject(error));
                } else {
                    reject('There are no assets with this tag!');
                }
            }, error => reject(error));
        });
    }

}

module.exports = new GitHubClient();