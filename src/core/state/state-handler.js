const fs = require('fs');
const path = require('path');
const State = require('./state');

class StateHandler {
    
    constructor() {
        this.onInit();
    }

    onInit() {
        this.savePath = path.join(__dirname, 'state.json');
    }

    get state() {
        try {
            return require(this.savePath);
        } catch (error) {
            console.error(error);
            return new State();
        }
    }

    set state(newState) {
        const data = JSON.stringify(newState);
        fs.writeFileSync(this.savePath, data);
    }

    set serverId(id) {
        let newState = this.state;
        newState.serverId = id;
        this.state = newState;
    }

    get serverId() {
        this.state.serverId;
    }

}

module.exports = new StateHandler();