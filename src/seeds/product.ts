import {Product} from "../models/product.model";

module.exports = () => {
  return Product.bulkCreate([
    {
      code: 'ACCESS001',
      label: 'USB SanDisk 256G',
      ht_price: 80000,
      ttc_price: 100000,
      is_serializable: false,
      fk_category_id: 1
    },
    {
      code: 'JV001',
      label: 'PlayStation 5',
      ht_price: 3200000,
      ttc_price: 4000000,
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'PHONE',
      label: 'IPhone 14',
      ht_price: 3200000,
      ttc_price: 4000000,
      is_serializable: true,
      fk_category_id: 5
    }
  ]).then(() => console.log('Seed product complete'));
};