import { CartStatus } from "../models/cart-status.model";
module.exports = () => {
  return CartStatus.bulkCreate([
    {
      cart_status_code: 'IN-PROGRESS',
      cart_status_label: 'En cours'
    },
    {
      cart_status_code: 'PENDING',
      cart_status_label: 'En attente'
    },
    {
      cart_status_code: 'CANCELED',
      cart_status_label: 'Annullé'
    },
    {
      cart_status_code: 'VALIDATE',
      cart_status_label: 'Validé'
    }
  ])
}