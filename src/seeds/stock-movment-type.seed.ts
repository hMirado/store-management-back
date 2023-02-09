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
            movment: 'IN-TRANSFER-ACCEPTED',
            label: 'Réception de stock accepté',
            description: 'Entré de stock accepté après un transfert/reception depuis un autre boutique'
        },
        {
            movment: 'IN-TRANSFER-CANCELLED',
            label: 'Réception de stock annulé',
            description: 'Entré de stock annulé après un transfert/reception depuis un autre boutique'
        },
        {
            movment: 'OUT-TRANSFER',
            label: 'Sortie de stock',
            description: 'Sortie de stock suite à un transfert/envoi vers un autre boutique'
        },
        {
            movment: 'OUT-SELL',
            label: 'Vente',
            description: 'Sortie de stock suite à une vente'
        }
    ]).then( () => console.log('Seed StockMovmentType complete'))
}