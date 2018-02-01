// import 'babel-polyfill';

// ========================== custom modules ==========================
import { dev } from './config.json';
import routes from './routes';
import errHandler from './handlers/errorHandler';
import dbHandler from './handlers/dbHandler';
import asHandler from './handlers/asHandler';
// ========================== dependecy modules ==========================
import bodyParser from 'body-parser';
import express from 'express';
const app = express();

// parsing req/res body to json
app.use(bodyParser.json({ limit: '50mb' }));

// for parsing the url encoded data using qs library
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// pass app object to routes method for registering routes
routes(app);

// error handling for all routes
errHandler(app);

// open db connection, when successful start application
// dbHandler.openConnection().then(() => {
console.log(dev.PORT);
app.listen(dev.PORT, () => {
    console.log(`server started ${dev.PORT} `);
    console.log(`Worker ${process.pid} started `);
});
// });

// for process kill signal only on windows
if (process.platform === "win32") {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
}

// kill process when Ctrl+C is hit
process.on('SIGINT', () => {
    console.log('bye bye !');
    dbHandler.closeConnection(() => {
        asHandler.closeConnection();
        process.exit();
    });
});