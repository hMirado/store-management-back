//export{}
//const StockMovmentType = require('../models/stock-movment-type.model');
import {StockMovmentType} from '../models/stock-movment-type.model'

module.exports = () => {
    return StockMovmentType.bulkCreate([
        {
            movment: 'IN-IMPORT',
            label: 'Import de stock',
            description: 'Ajout/Import d\'un article en stock'
        },
        {
            movment: 'IN-TRANSFER',
            label: 'Transfert d\'article',
            description: 'Entré de stock d\'article après transfert entre deux shops'
        },
        {
            movment: 'OUT-TRANSFER',
            label: 'Transfert d\'article',
            description: 'Sorti de stock d\'article après transfert entre deux shops'
        },
        {
            movment: 'OUT-SELL',
            label: 'Vente',
            description: 'Sortie de stock suite à une vente'
        }
    ]).then( () => console.log('Seed StockMovmentType complete'))
}