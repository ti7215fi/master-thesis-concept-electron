'use strict';
const path = require('path');
const request = require('request');
const releaseManager = require('./src/core/release-manager');
const fs = require('fs');
const clientLoader = require('./src/client-loader');
const serverManager =  require('./src/client-manager');
const clientService = require('./src/client-service');
const stateHandler = require(path.join(__dirname, 'src/core/state', 'state-handler.js'));
const fileValidator = require('./src/file-validator');
const userState = require('./src/core/storage/user-state');

class SelectServerForm {

    constructor() {
        this.onInit();
    }

    get selectBox() {
        return document.getElementById('serverSelectBox');
    }

    onInit() {
        serverManager.servers.forEach((server) => {
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
        const client = serverManager.getClientById(+id);
        stateHandler.serverId = +id;
        clientLoader.loadClient(client);
    }*/

    submit() {
        const id = +this.selectBox.options[this.selectBox.selectedIndex].value;
        const client = serverManager.getClientById(id);
        userState.currentServerId = id;
        request.get(`${client.url}/client-app/version`, (error, httpResponse, releaseVersion) => {
            releaseManager.loadRelease(releaseVersion);
        }, error => console.error(error));
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
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