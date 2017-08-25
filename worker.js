/*
Sieve of Eratosthenes algorithm
*/
function PrimesGenerator() {

    var self = this;
    this.primes = null;

    this._initializeList = function(max) {
        self.primes = new Array(max);
        self.primes.fill(true);
    };

    this._doCalculations = function() {

        for (var i = 2; i < self.primes.length; i++) {
            if (!self.primes[i]) {
                continue;
            }

            for (j = i; i * j < self.primes.length; j++)
                self.primes[i * j] = false;
        }
    };

    this._getPrimes = function() {

        var result = [];
        var position = 0;

        for (var index = 2; index < self.primes.length; index++) {

            if (!self.primes[index])
                continue;

            position++;
            result.push({ position: position, value: index });
        }

        return result;
    };

    this.getPrimes = function(max) {
        self._initializeList(max < 2 ? 2 : max);
        self._doCalculations();
        return self._getPrimes();
    };
}

/* 
Fibonacci sequence algorithm in Javascript

https://medium.com/developers-writing/fibonacci-sequence-algorithm-in-javascript-b253dc7e320e
*/
function Fibonacci() {

    var self = this;

    this.fibonacciMemoization = function(num, memo) {
        memo = memo || {};

        if (memo[num]) return memo[num];
        if (num <= 1) return 1;

        return memo[num] = self.fibonacciMemoization(num - 1, memo) + self.fibonacciMemoization(num - 2, memo);
    };

    this.fibonacciRecursive = function(num) {
        if (num <= 1) return 1;

        return self.fibonacciRecursive(num - 1) + self.fibonacciRecursive(num - 2);
    };

    this.fibonacciLoop = function(num) {
        var a = 1,
            b = 0,
            temp;

        while (num >= 0) {
            temp = a;
            a = a + b;
            b = temp;
            num--;
        }

        return b;
    };
}

/*.......................................................
Code for the worker
.........................................................*/
var generator = new PrimesGenerator();
var fibonacci = new Fibonacci();

self.addEventListener('message', function(e) {
    var data = e.data;

    switch (data.cmd) {
        case 'primes':
            var value = parseInt(data.max);
            self.postMessage({ cmd: "primes", message: "Primes calculation started with value " + value });
            var primes = generator.getPrimes(value);
            self.postMessage({ cmd: "completed", value: primes, message: primes.length + " primes number generated" });
            break;
        case 'fibonacciSlow':
            var value = parseInt(data.value);
            self.postMessage({ cmd: "fibonacci", message: "Fibonacci calculation (slow method) started with value " + value });
            var fib = fibonacci.fibonacciRecursive(value);
            self.postMessage({ cmd: "completed", value: fib, message: "Fibonacci value = " + fib });
            break;
        case 'fibonacciFast':
            var value = parseInt(data.value);
            self.postMessage({ cmd: "fibonacci", message: "Fibonacci calculation (slow method) started with value " + value });
            var fib = fibonacci.fibonacciMemoization(value);
            self.postMessage({ cmd: "completed", value: fib, message: "Fibonacci value = " + fib });
            break;
        case 'stop':
            self.postMessage({ cmd: "stopped", message: "Worker stopped" });
            self.close(); // Terminates the worker.
            break;
        default:
            self.postMessage({ cmd: "unknow", message: 'Unknown command: ' + data.cmd });
    };
}, false);