import { Payment } from "../models/payment.model";

module.exports = () => {
  return Payment.bulkCreate([
    {
      payment_key: 'CASH',
      payment_label: 'Espèce'
    },
    {
      payment_key: 'ORANGE-MONEY',
      payment_label: 'Orange Money'
    },
    {
      payment_key: 'MVOLA',
      payment_label: 'Mvola'
    },
    {
      payment_key: 'AIRTEL-MONEY',
      payment_label: 'Airtel Money'
    },
    {
      payment_key: 'CREDIT-CARD',
      payment_label: 'Carte de crédit'
    },
    {
      payment_key: 'CHEQUE',
      payment_label: 'Chéque'
    }
  ]).then(() => console.log('\n Seed payment complete'))
}