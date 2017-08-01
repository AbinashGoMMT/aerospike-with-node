import moduleNameHandler from './moduleNameHandler';

export default (router) => {

    router.get('/get_someEntity', async(req, res, next) => {
        try {
            const resData = await moduleNameHandler.any_method(req.get("someParam")); -
            res.status(200).send({ entity_id: resData.entity_id });
        } catch (error) {
            next(error.message);
        }
    });

};