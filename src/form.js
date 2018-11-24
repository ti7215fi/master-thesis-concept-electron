'use strict';
const path = require('path');
const request = require('request');
const releaseManager = require('./src/core/release-manager');

class SelectServerForm {

    constructor() {
        this.clientLoader = require('./src/client-loader');
        this.serverManager =  require('./src/client-manager');
        this.clientService = require('./src/client-service');
        this.stateHandler = require(path.join(__dirname, 'src/core/state', 'state-handler.js'));
        this.onInit();
    }

    get selectBox() {
        return document.getElementById('serverSelectBox');
    }

    onInit() {
        this.serverManager.servers.forEach((server) => {
            let option = document.createElement('option');
            option.value = server.id;
            option.innerHTML = server.name;
            this.selectBox.appendChild(option);
        });
        document.getElementById('serverFile').addEventListener('change', this.handleFileSelect);
    }

    /*onInit() {
        this.clientService.getServerList().then((servers) => {
            servers.forEach((server) => {
                let option = document.createElement('option');
                option.value = server.id;
                option.innerHTML = server.name;
                this.selectBox.appendChild(option);
            });
        }, (error) => console.error(error));
    }*/

    /*submit() {
        const id = this.selectBox.options[this.selectBox.selectedIndex].value;
        const client = this.serverManager.getClientById(+id);
        this.stateHandler.serverId = +id;
        this.clientLoader.loadClient(client);
    }*/

    submit() {
        const id = this.selectBox.options[this.selectBox.selectedIndex].value;
        const client = this.serverManager.getClientById(+id);
        request.get(`${client.url}/client-app/version`, (error, httpResponse, releaseVersion) => {
            releaseManager.loadRelease(releaseVersion);
        }, error => console.error(error));
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        const fs = require('fs');
        const fileValidator = require('./src/file-validator');
        if (!fileValidator.hasValidExtension(file.path)) {
            document.getElementById('serverFile').value = '';
            console.error('wrong file extension');
        } else {
            reader.onload = (event) => {
                const content = event.target.result;
                if (!fileValidator.hasValidContent(content)) {
                    console.error('invalid content');
                } else {
                    fs.writeFile('servers.json', content, (error) => {
                        if (error) {
                            console.error(error);
                        }
                        console.log('successful import')
                    });
                }
            }
            reader.readAsText(file);
        }
    }

}

const selectServerForm = new SelectServerForm();