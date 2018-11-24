const request = require('request');

class HttpService {

    get url() {
        return `${this.protocol}://${this.host}${this.port}`;
    }

    constructor(protocol = '', host = '', port = '') {
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