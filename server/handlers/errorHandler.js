export default (app) => {

    if (process.env.NODE_ENV === 'dev') {
        // error handling middleware must take four param method signature
        app.use((err, req, res, next) => {
            res.status(err.status || 500).send(err.message);
            // res.status(500).send({ error: err, message: err.message });
        });
    } else {
        // error handling middleware must take four param method signature
        app.use((err, req, res, next) => {
            res.status(500).send(err.message);
        });
    }

};
