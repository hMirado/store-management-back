import { TransferType } from "../models/transfer-type.model";
module.exports = () => {
  return TransferType.bulkCreate([
    {
      transfer_type_code: 'INCOMING',
      transfer_type_label: 'Réception'
    },
    {
      transfer_type_code: 'OUTCOMING',
      transfer_type_label: 'Envoi'
    }
  ])
};