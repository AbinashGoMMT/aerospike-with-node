export default (app) => {

    if (process.env.NODE_ENV === 'dev') {
        app.use((err, req, res) => {
            res.status(err.status || 500).send(err.message);
            // res.status(500).send({ error: err, message: err.message });
        });
    } else {
        app.use((err, req, res) => {
            res.status(500).send(err.message);
        });
    }

};