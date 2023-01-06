const Category = require('./category.model');
const Product = require('./product.model');
const Attribute = require('./attribute.model');
const Company = require('./company.model');
const Shop = require('./shop.model');
const Stock = require('./stock.model');
import { StockMovment } from './stock-movment.model';
import { StockMovmentType } from './stock-movment-type.model';
import { Serialization } from './serialization.model';
import { SerializationType } from './serialization-type.model';
import { User } from './user.model';
import { Role } from './role.model';
import { Authorization } from './authorization.model';
import { AuthorizationRole } from './authorization-role.model';
import { AttributeType } from './attribute-type.model';

/**
 * @summary: COMPANY & SHOP
 * @description: Relation between Company and Shop
 */
Company.hasMany(Shop, {
  foreignKey: {
    name: "fk_company_id",
    allowNull: false
  },
  sourceKey: "company_id"
});
Shop.belongsTo(Company, {
  foreignKey: {
    name: "fk_company_id",
    allowNull: false
  },
  targetKey: "company_id"
});


/**
 * @summary: SHOP & STOCK
 * @description: Relation between shop & stock
 */
Stock.belongsTo(Shop, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  targetKey: "shop_id",
});
Shop.hasMany(Stock, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  sourceKey: "shop_id"
});


/**
 * @summary: CATEGORY & PRODUCT
 * @description: Relation between Category and Product
 */
Category.hasMany(Product, {
  foreignKey: {
    name: "fk_category_id",
    allowNull: false
  },
  sourceKey: "category_id"
});
Product.belongsTo(Category, {
  foreignKey: {
    name: "fk_category_id",
    allowNull: false
  },
  targetKey: "category_id",
});


/**
 * @summary: PRODUCT & ATTRIBUTE
 * @description: Relation between Product and Attribute
 */
Product.hasMany(Attribute, 
  {
    foreignKey: {
      name: "fk_product_id",
      allowNull: false
    },
    sourceKey: "product_id"
  }
);
Attribute.belongsTo(Product, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  targetKey: "product_id",
});


/**
 * @summary: ATTRIBUTE & ATTRIBUTE TYPE
 * @description: Relation between Attribute and Attribute Type
 */
AttributeType.hasMany(Attribute, 
  {
    foreignKey: {
      name: "fk_attribute_type_id",
      allowNull: false
    },
    sourceKey: "attribute_type_id"
  }
);
Attribute.belongsTo(AttributeType, {
  foreignKey: {
    name: "fk_attribute_type_id",
    allowNull: false
  },
  targetKey: "attribute_type_id",
});


/**
 * @summary: PRODUCT & STOCK
 * @description: Relation between stock et product
 */
Product.hasOne(Stock, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  sourceKey: "product_id"
});
Stock.belongsTo(Product, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  targetKey: "product_id"
});


/**
 * @summary: STOCK_MOVMENT & STOCK-MOVMENT-TYPE
 * @description: Relation between stock-movment et stock-movment-type
 */
 StockMovmentType.hasMany(StockMovment, {
  foreignKey: {
      name: "fk_stock_movment_type_id",
      allowNull: false
  },
  sourceKey: "stock_movment_type_id"
});
StockMovment.belongsTo(StockMovmentType, {
  foreignKey: {
      name: "fk_stock_movment_type_id",
      allowNull: false
  },
  targetKey: "stock_movment_type_id"
});


/**
 * @summary: PRODUCT & STOCK-MOVMENT
 * @description: Relation between stock et stock-movment
 */
Product.hasMany(StockMovment, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  sourceKey: "product_id"
});
StockMovment.belongsTo(Product, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  targetKey: "product_id"
});


/**
 * @summary: SHOP & STOCK-MOVMENT
 * @description: Relation between shop & stock-movment
 */
 StockMovment.belongsTo(Shop, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  targetKey: "shop_id",
});
Shop.hasMany(StockMovment, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  sourceKey: "shop_id"
});


/**
 * @summary: PRODUCT & SERIALIZATION
 * @description: Relation between product et serialization
 */
Serialization.belongsTo(Product, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  targetKey: "product_id"
});
Product.hasMany(Serialization, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  sourceKey: "product_id"
});


/**
 * @summary: SERIALIZATION & SERIALIZATION-TYPE
 * @description: Relation between serialization et serialization-type
 */
Serialization.belongsTo(SerializationType, {
  foreignKey: {
      name: "fk_serialization_type_id",
      allowNull: false
  },
  targetKey: "serialization_type_id"
});
SerializationType.hasMany(Serialization, {
  foreignKey: {
      name: "fk_serialization_type_id",
      allowNull: false
  },
  sourceKey: "serialization_type_id"
});


/**
 * @summary: SERIALIZATION & SHOP
 * @description: Relation between serialization et shop
 */
Serialization.belongsTo(Shop, {
  foreignKey: {
      name: "fk_shop_id",
      allowNull: false
  },
  targetKey: "shop_id"
});
Shop.hasMany(Serialization, {
  foreignKey: {
      name: "fk_shop_id",
      allowNull: false
  },
  sourceKey: "shop_id"
});


/**
 * @summary: USER & SHOP
 * @description: Relation between user and shop
 */
User.belongsTo(Shop, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  targetKey: "shop_id"
});
Shop.hasMany(User, {
  foreignKey: {
      name: "fk_shop_id",
      allowNull: false
  },
  sourceKey: "shop_id"
});


/**
 * @summary: USER & ROLE
 * @description: Relation between user and role
 */
Role.hasMany(User, {
  foreignKey: {
    name: "fk_role_id",
    allowNull: false
  },
  sourceKey: "role_id"
});
User.belongsTo(Role, {
  foreignKey: {
    name: "fk_role_id",
    allowNull: false
  },
  targetKey: "role_id"
});


/**
 * @summary: ROLE & AUTHORIZATION 
 * @description: Relation between user and authorization
 */
Authorization.belongsToMany(
  Role, 
  { 
    through: AuthorizationRole,
    foreignKey: {
      name: "authorization_id",
      allowNull: false
    } 
  }
);
Role.belongsToMany(
  Authorization, 
  { 
    through: AuthorizationRole,
    foreignKey: {
      name: "role_id",
      allowNull: false
    } 
  }
);

module.exports = { 
  Company, 
  Shop, 
  Category, 
  Product, 
  Attribute,
  AttributeType,
  Stock, 
  StockMovment, 
  StockMovmentType, 
  Serialization, 
  SerializationType,
  Role,
  User,
  Authorization,
  AuthorizationRole
};