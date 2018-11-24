const { remote, BrowserWindow, app } = require('electron');
const clientService = require('../client-service');
const archiveHandler = require('../archive-handler');
const clientManager = require('../client-manager');
const stateHandler = require('./state/state-handler');
const releaseManager = require('./release-manager');
const request = require('request');
const path = require('path');
const fs = require('fs');
const userState = require('./storage/user-state');

class AppUpdater {

    constructor() {
        this.windowOpen = false;
    }

    checkForUpdates() {
        setInterval(() => {
            const serverId = userState.currentServerId;
            if (serverId !== null && serverId !== undefined) {
                const server = clientManager.getClientById(serverId);
                request.get(`${server.url}/client-app/version`, (error, httpResponse, releaseVersion) => {
                    if (!error) {
                        releaseManager.loadRelease(releaseVersion);
                    }
                });
            }
        }, 3000);
    }

}

module.exports = new AppUpdater();