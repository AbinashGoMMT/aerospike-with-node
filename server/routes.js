import express from 'express';
const router = express.Router();

// import all custom router objects
const routes = [
    require('./modules/pathfinder/pathfinderRouter')
];

export default (app) => {

    // passing router object to all custom router object methods
    routes.forEach((routeObj) => {
        routeObj.default(router);
    });

    // register routes to app
    app.use(router);

};