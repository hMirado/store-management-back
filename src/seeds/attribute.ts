import { Attribute } from "../models/attribute.model";

module.exports = () => {
  return Attribute.bulkCreate([
    {
      storage: 512,
      storage_type: 'SSD',
      fk_product_id: 2
    }
  ]).then(() => console.log('\n Seed attribute complete'));
}
