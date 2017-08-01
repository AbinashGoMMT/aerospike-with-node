import mongoose from 'mongoose';
const schema = mongoose.Schema;

const moduleNameSchema = new schema({
    entity_id: { type: String, required: true },
    entity_name: { type: String, required: true, es_indexed: true }
});

const moduleNameModel = mongoose.model('moduleName', moduleNameSchema);

export default moduleNameModel;