//export{}
//const StockMovmentType = require('../models/stock-movment-type.model');
import {StockMovmentType} from '../models/stock-movment-type.model'

module.exports = () => {
    return StockMovmentType.bulkCreate([
        {
            movment: 'IN-IMPORT'
        },
        {
            movment: 'IN-TRANSFER'
        },
        {
            movment: 'IN-TRANSFER-CANCELLED'
        },
        {
            movment: 'OUT-TRANSFER'
        },
        {
            movment: 'OUT-SELL'
        }
    ]).then( () => console.log('Seed StockMovmentType complete'))
}