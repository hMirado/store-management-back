import { StatusTransfer } from "../models/status-transfert.model";

module.exports = () => {
  return StatusTransfer.bulkCreate([
    {
      status_code: 'IN_PROGRESS',
      status_label: 'en cours'
    },
    {
      status_code: 'VALIDATED',
      status_label: 'validé'
    },
    {
      status_code: 'CANCELLED',
      status_label: 'annulé'
    },
  ])
}