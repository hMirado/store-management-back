const Company = require('../models/company.model');

module.exports = () => {
    return Company.bulkCreate([ // Returning and thus passing a Promise here
      {company_name: 'Planet Game'},
      {company_name: 'Planet One'}
    ]);
};