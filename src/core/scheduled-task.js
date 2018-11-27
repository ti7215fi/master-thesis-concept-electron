const CronJob = require('cron').CronJob;

class ScheduldedTask {

    /**
     * @param {string | Date} time The time to fire off your job. This can be in the form of cron syntax or a JS Date object.
     * @param {Function} onTick The function to fire at the specified time.
     */
    constructor(time, onTick) {
        this.task = new CronJob(time, onTick);
    }

    get isRunning() {
        return this.task.running;
    }

    start() {
        this.task.start();
    }

    stop() {
        this.task.stop();
    }


}

module.exports = ScheduldedTask;