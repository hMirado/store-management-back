import {Product} from "../models/product.model";

module.exports = () => {
  return Product.bulkCreate([
    {
      code: 'ACC001',
      label: 'USB SanDisk 256G',
      is_serializable: false,
      fk_category_id: 1,
    },
    {
      code: 'ACC002',
      label: 'HDD Western Digital 1To',
      is_serializable: false,
      fk_category_id: 1
    },
    {
      code: 'G001',
      label: 'PlayStation 5 Standart 500GB',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'G002',
      label: 'PlayStation 5 Digital 1T',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'G003',
      label: 'PlayStation 4 Pro Multi 320GB',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'G004',
      label: 'Nintendo Switch Oled',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'G005',
      label: 'Xbox Series X',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'G006',
      label: 'Xbox Series S',
      is_serializable: true,
      fk_category_id: 3
    },
    {
      code: 'SM001',
      label: 'IPhone 14',
      is_serializable: true,
      fk_category_id: 5
    },
    {
      code: 'SM002',
      label: 'IPhone 13',
      is_serializable: true,
      fk_category_id: 5
    },
    {
      code: 'TAB001',
      label: 'Samsung Galaxy Tab S7',
      is_serializable: true,
      fk_category_id: 6
    },
    {
      code: 'ACC03',
      label: 'JBL Charge 5',
      is_serializable: false,
      fk_category_id: 1
    },
    {
      code: 'TAB002',
      label: 'Huawei Mediapad M5',
      is_serializable: true,
      fk_category_id: 6
    },
    {
      code: 'G007',
      label: 'Logitech G29',
      is_serializable: true,
      fk_category_id: 3
    },
  ]).then(() => console.log('Seed product complete'));
};