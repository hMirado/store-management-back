//export{}
//const StockMovmentType = require('../models/stock-movment-type.model');
import {StockMovmentType} from '../models/stock-movment-type.model'

module.exports = () => {
    return StockMovmentType.bulkCreate([
        {
            movment: 'IN'
        },
        {
            movment: 'OUT'
        }
    ]).then( () => console.log('Seed StockMovmentType complete'))
}