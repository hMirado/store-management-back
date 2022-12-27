const Description = require('../models/attribute.model');

module.exports = function() {
  return Attribute.bulkCreate([
    {
      storage: 512,
      storage_type: 'SSD',
      fk_product_id: 2
    }
  ]).then(_ => console.log('Seed attribute complete'));
}