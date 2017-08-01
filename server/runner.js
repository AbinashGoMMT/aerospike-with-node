import 'babel-polyfill';

import dbHandler from './handlers/dbHandler';
import cluster from 'cluster';
import os from 'os';
const numCPUs = os.cpus().length;
const workers = [];

if (cluster.isMaster) {

    console.log(`Master ${process.pid} is running with ${numCPUs} workers `);

    for (let i = 0; i < numCPUs; i++) {
        workers[i] = cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker with process id ${worker.process.pid} is online `);
    });

    cluster.on('exit', (worker, code, signal) => {
        if (code != 0) {
            console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal} `);
            console.log(`Starting a new worker `);
            workers.push(cluster.fork());
        }
    });

    process.on("SIGUSR2", () => {
        console.log(`SIGUSR2 received, reloading workers`);
        delete require.cache[require.resolve('./server')];
        let i = 0;

        const restart = () => {
            if (i == workers.length) return;
            console.log(`Killing ${workers[i]}`);

            dbHandler.closeConnection(() => {
                workers[i].disconnect();
                cluster.on("disconnect", () => {
                    console.log(`Shutdown complete`);
                });

                const newWorker = cluster.fork();
                newWorker.on("listening", () => {
                    console.log(`Replacement worker online `);
                    i++;
                    restart();
                });
            });
        };
        restart();
    });

} else {
    require('./server');
}