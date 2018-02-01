import Aerospike from 'aerospike';

import { dev } from './../config.json';
// console.log(dev.dburl);
const dburl = dev.dbUrl.aerospikeUrl;

const config = {
    hosts: dburl
};

let client = null;

export default {
    closeConnection,
    read_record,
    write_record,
    delete_record
};


function openConnection() {
    return new Promise((res, rej) => {
        Aerospike.client(config).connect((err, clientObj) => {
            if (err) {
                console.log(`err while connecting to aerospike ${err}`);
                rej(err);
            } else {
                console.log('aerospike connection successful');
                client = clientObj;
                res(clientObj);
            }
        });
    });
}

function closeConnection() {
    client.close();
}

function getClient() {
    if (client) {
        return Promise.resolve(client);
    } else {
        return openConnection();
    }
}


/**
 * reads records from aerospike db using params passed
 *
 * @param {any} namespace
 * @param {any} set
 * @param {any} id
 * @param {any} [reqdFields=null] select fields which you want to send back to user
 * @returns record requested by user, else user will be sent err msg if record doesn't exists or some error is encountered
 */
function read_record(namespace, set, id, reqdFields = null) {
    return new Promise((res, rej) => {
        getClient().then(clientObj => {
            const key = new Aerospike.Key(namespace, set, id);
            clientObj.select(key, reqdFields, (err, record) => {
                if (err) {
                    switch (err.code) {
                        case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
                            rej({ message: 'record not found' });
                            break;
                        default:
                            console.log(`err while reading record ${err}`);
                            rej(err);
                            break;
                    }
                } else {
                    const { bins } = record;
                    res(bins);
                };
            });
        });
    });
}


/**
 * writes record into the aerospike db
 *
 * @param {any} namespace
 * @param {any} set
 * @param {any} id
 * @param {any} bins data field object which will be inserted
 * @returns returns true when success else error object is passed
 */
function write_record(namespace, set, id, bins) {
    return new Promise((res, rej) => {
        getClient().then(clientObj => {
            const key = new Aerospike.Key(namespace, set, id);
            clientObj.put(key, bins, (err) => {
                if (err) {
                    console.log(`err while inserting record ${err}`);
                    rej(err);
                } else {
                    // console.log(`record inserted successfully`);
                    res(true);
                };
            });
        });
    });
}


/**
 * removes record from aerospike db
 *
 * @param {any} namespace
 * @param {any} set
 * @param {any} id
 * @returns true when success else error obj is passed
 */
function delete_record(namespace, set, id) {
    return new Promise((res, rej) => {
        getClient().then(clientObj => {
            const key = new Aerospike.Key(namespace, set, id);
            clientObj.remove(key, (err) => {
                if (err) {
                    rej(err);
                } else {
                    res(true);
                }
            });
        });
    });
}