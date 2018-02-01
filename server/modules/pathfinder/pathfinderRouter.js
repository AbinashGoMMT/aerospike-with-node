// import pathfinderHandler from './pathfinderHandler';
import asHandler from './../../handlers/asHandler'; // in normal case, asHandler will be kept inside pathfinderHandler

export default (router) => {

    router.get('/get_someEntity', async(req, res, next) => {
        try {
            const resData = await moduleNameHandler.any_method(req.get("someParam")); -
            res.status(200).send({ entity_id: resData.entity_id });
        } catch (error) {
            next(error.message);
        }
    });


    router.get('/read_record', (req, res, next) => {
        const { namespace, set, id } = req.headers;
        asHandler.read_record(namespace, set, id, ['uid', 'className']).then(record => {
            res.status(200).send({ result: record });
        }).catch(err => {
            next(err.message);
        });
    });


    router.post('/write_record', (req, res, next) => {
        const { namespace, set, id, data } = req.body;
        asHandler.write_record(namespace, set, id, data).then(() => {
            res.status(200).send({ message: 'record inserted successfully' });
        }).catch(err => next(err.message));
    });


    router.get('/delete_record', (req, res, next) => {
        const { namespace, set, id } = req.headers;
        asHandler.delete_record(namespace, set, id).then(() => {
            res.status(200).send({ result: 'record deleted successfully' });
        }).catch(err => {
            next(err.message);
        });
    });
};