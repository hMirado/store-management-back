import { TransferStatus } from "../models/transfer-status.model";

module.exports = () => {
  return TransferStatus.bulkCreate([
    {
      transfer_status_code: 'IN_PROGRESS',
      transfer_status_label: 'en cours'
    },
    {
      transfer_status_code: 'VALIDATED',
      transfer_status_label: 'validé'
    },
    {
      transfer_status_code: 'CANCELLED',
      transfer_status_label: 'annulé'
    },
  ])
}