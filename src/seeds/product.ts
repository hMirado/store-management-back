import {Product} from "../models/product.model";

module.exports = () => {
  return Product.bulkCreate([
    {
      code: 'ACCESS001',
      label: 'USB SanDisk 256G',
      is_serializable: false,
      fk_category_id: 1
    },
    {
      code: 'ACCESS002',
      label: 'HDD Western Digital 1To',
      is_serializable: false,
      fk_category_id: 1
    },
    {
      code: 'PS5ES',
      label: 'PlayStation 5 Standart',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'PS5ED',
      label: 'PlayStation 5 Digital',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'PS4',
      label: 'PlayStation 4',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'NSw',
      label: 'Nintendo Switch',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'NSO',
      label: 'Nintendo Switch Oled',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'XSX',
      label: 'Xbox Series X',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'XSS',
      label: 'Xbox Series S',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'IPHONE14',
      label: 'IPhone 14',
      is_serializable: true,
      fk_category_id: 5
    },
    {
      code: 'IPHONE13',
      label: 'IPhone 13',
      is_serializable: true,
      fk_category_id: 5
    },
    {
      code: 'GTS7',
      label: 'Samsung Galaxy Tab S7',
      is_serializable: true,
      fk_category_id: 6
    },
    {
      code: 'JBLC5',
      label: 'JBL Charge 5',
      is_serializable: false,
      fk_category_id: 1
    },
    {
      code: 'HM5',
      label: 'Huawei Mediapad M5',
      is_serializable: true,
      fk_category_id: 6
    },
    {
      code: 'G29',
      label: 'Logitech G29',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'PS3',
      label: 'Playstation 3',
      is_serializable: true,
      fk_category_id: 3
    },
  ]).then(() => console.log('Seed product complete'));
};