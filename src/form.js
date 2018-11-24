'use strict';
const fs = require('fs');
const releaseManager = require('./src/core/release-manager');
const fileValidator = require('./src/core/file/file-validator');
const userState = require('./src/core/storage/user-state');
const serverService = require('./src/core/network/server-service');

class SelectServerForm {

    constructor() {
        this.onInit();
    }

    get selectBox() {
        return document.getElementById('serverSelectBox');
    }

    /**
     * #2 Solution: Load server list from local file.
     */
    onInit() {
        serverService.servers.forEach((server) => {
            let option = document.createElement('option');
            option.value = server.id;
            option.innerHTML = server.name;
            this.selectBox.appendChild(option);
        });
        document.getElementById('serverFile').addEventListener('change', this.handleFileSelect);
    }

    submit() {
        const id = +this.selectBox.options[this.selectBox.selectedIndex].value;
        const server = serverService.getServerById(id);
        userState.currentServerId = id;
        serverService.getAppVersion(server.url).then((releaseVersion) => {
            releaseManager.loadRelease(releaseVersion);
        }, error => console.error(error));
    }

    /**
     * #1 Solution: Load server list from server.
     
    onInit() {
        serverService.servers().then((servers) => {
            servers.forEach((server) => {
                let option = document.createElement('option');
                option.value = server.id;
                option.innerHTML = server.name;
                this.selectBox.appendChild(option);
            });
        }, (error) => console.error(error));
    }*/

    /**
     * @param {*} event 
     * #3 Solution: Import server list from file.
     */
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