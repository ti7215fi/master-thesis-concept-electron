const request = require('request');

class HttpService {

    get url() {
        const port = this.port ? `:${this.port}` : '';
        return `${this.protocol}://${this.host}${port}`;
    }

    constructor(protocol, host, port = null) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
    }

    get(url, options = {}, parseAsJson = true) {
        return new Promise((resolve, reject) => {
            request.get(url, options, (error, httpResponse, body) => {
                if(!error) {
                    resolve({
                        httpResponse: httpResponse,
                        body: parseAsJson ? JSON.parse(body) : body,
                    });
                }
                reject(error);
            });
        });
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            request.post(url, data, (error, httpResponse, body) => {
                if(!error) {
                    resolve({
                        httpResponse: httpResponse,
                        body: JSON.parse(body),
                    }); 
                }
                reject(error);
            });
        });
    }
}

module.exports = HttpService;