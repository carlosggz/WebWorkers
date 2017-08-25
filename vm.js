function WorkerVm(workerScript) {

    var self = this;
    this.worker = new Worker(workerScript);
    this.log = ko.observableArray([]);
    this.inProgress = ko.observable(false);
    this.wasStopped = ko.observable(false);

    this.worker.addEventListener('message', function(e) {

        self.addToLog(e.data.message);

        if (e.data.cmd == "completed") {
            //console.log(e.data.value);
            self.inProgress(false);
        } else if (e.data.cmd != 'unknow' && e.data.cmd != 'stopped') {
            self.addToLog('Worker is processing your calculation...');
            self.inProgress(true);
        } else {
            self.inProgress(false);
        }
    }, false);

    this._doTask = function(data) {

        if (self.wasStopped()) {
            self.addToLog('Worker was stopped');
            return;
        }

        self.worker.postMessage(data);
    };
    this.generatePrimes = function() {

        self._doTask({
            cmd: "primes",
            max: 1000000
        });
    };

    this.fibFast = function() {

        self._doTask({
            cmd: "fibonacciFast",
            value: 100
        });
    };

    this.fibSlow = function() {
        self._doTask({
            cmd: "fibonacciSlow",
            value: 40
        });
    };

    this.stop = function() {
        self._doTask({
            cmd: "stop"
        });

        self.wasStopped(true);
        self.addToLog("Worker stopped");
    };

    this.addToLog = function(message) {
        self.log.push({ message: message, date: new Date().toLocaleTimeString() });
    };
}