//export{}
//const SerializationType = require('../models/serialization-type.model');
import {SerializationType} from '../models/serialization-type.model'

module.exports = () => {
    return SerializationType.bulkCreate([
        {
            code: 'SERIAL_NUMBER',
            label: 'Numéro de série',
        },
        {
            code: 'IMEI',
            label: 'IMEI',
        }
    ]).then(() => console.log('Seed SerializationMovment complete'))
};