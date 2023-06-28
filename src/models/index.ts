const Category = require('./category.model');
import { Product } from './product.model';
import { Attribute } from './attribute.model';
const Company = require('./company.model');
const Stock = require('./stock.model');
import { Shop } from './shop.model';
import { StockMovment } from './stock-movment.model';
import { StockMovmentType } from './stock-movment-type.model';
import { Serialization } from './serialization.model';
import { SerializationType } from './serialization-type.model';
import { User } from './user.model';
import { Role } from './role.model';
import { Authorization } from './authorization.model';
import { AuthorizationRole } from './authorization-role.model';
import { AttributeType } from './attribute-type.model';
import { Price } from './price.model';
import { TransferStatus } from "./transfer-status.model";
import { Transfer } from "./transfer.model";
import { TransferType } from './transfer-type.model';
import { UserShop } from './user-shop.model';
import { TransferProduct } from './transfer-product.model';
import { TransferSerialization } from './transfer-serialization.model';
import { CashRegister } from './cash-register.model';
import { Payment } from './payment.model';
import { Cart } from './cart.model';
import { CartProduct } from './cart-product.model';

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
Attribute.belongsTo(Product, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  targetKey: "product_id",
});
Product.hasMany(Attribute, 
  {
    foreignKey: {
      name: "fk_product_id",
      allowNull: false
    },
    sourceKey: "product_id"
  }
);


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
Product.hasMany(Stock, {
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
User.belongsToMany(
  Shop, 
  { 
    through: UserShop,
    foreignKey: {
      name: "user_id",
      allowNull: false
    } 
  }
);
Shop.belongsToMany(
  User, 
  { 
    through: UserShop,
    foreignKey: {
      name: "shop_id",
      allowNull: false
    } 
  }
);


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


/**
 * @summary: PRODUCT & PRICE 
 * @description: Relation between product and price
 */
Product.hasMany(Price, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  sourceKey: "product_id"
});
Price.belongsTo(Product, {
  foreignKey: {
    name: "fk_product_id",
    allowNull: false
  },
  targetKey: "product_id"
});

/**
 * @summary: SHOP & PRICE 
 * @description: Relation between shop and price
 */
Shop.hasMany(Price, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  sourceKey: "shop_id"
});
Price.belongsTo(Shop, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  targetKey: "shop_id"
});

/**
 * @summary: PRICE & ATTRIBUTE
 * @description: Relation between price and attribute
 */
Price.hasMany(Attribute, {
  foreignKey: {
    name: "fk_price_id",
    allowNull: false
  },
  sourceKey: "price_id"
});
Attribute.belongsTo(Price, {
  foreignKey: {
    name: "fk_price_id",
    allowNull: false
  },
  targetKey: "price_id"
});


/**
 * @summary: TransfertStatus & StockTransfer
 * @description: Relation between TransfertStatus and StockTransfer
 */
TransferStatus.hasMany(Transfer, {
  foreignKey: {
    name: "fk_transfer_status_id",
    allowNull: false
  },
  sourceKey: "transfer_status_id"
});
Transfer.belongsTo(TransferStatus, {
  foreignKey: {
    name: "fk_transfer_status_id",
    allowNull: false
  },
  targetKey: "transfer_status_id"
});

// Type de transfert (envoi / reception)
// TransferType.hasMany(Transfer, {
//   foreignKey: {
//     name: "fk_transfer_type_id",
//     allowNull: false
//   },
//   sourceKey: "transfer_type_id"
// })
// Transfer.belongsTo(TransferType, {
//   foreignKey: {
//     name: "fk_transfer_type_id",
//     allowNull: false
//   },
//   targetKey: "transfer_type_id"
// });


/**
 * @summary: product & StockTransfer & Serialization & user (sender & receiver) & shop (sender & receiver)
 * @description: Relation with StockTransfer
 */
// Product
Product.belongsToMany(
  Transfer, 
  {
    through: TransferProduct,
    foreignKey: {
      name: "product_id",
      allowNull: false
    }
  }
); 
Transfer.belongsToMany(
  Product, 
  {
    through: TransferProduct,
    foreignKey: {
      name: "transfer_id",
      allowNull: false
    }
  }
);

// Serialization
Serialization.belongsToMany(
  Transfer,
  {
    through: TransferSerialization,
    foreignKey: {
      name: "serialization_id",
      allowNull: false
    }
  }
);
Transfer.belongsToMany(
  Serialization, 
  {
    through: TransferSerialization,
    foreignKey: {
      name: "transfer_id",
      allowNull: false
    }
  }
);

// User senders
User.hasMany(Transfer,  {
  foreignKey: {
    name: "fk_user_sender",
    allowNull: false
  },
  sourceKey: "user_id"
});
Transfer.belongsTo(User, {
  as: "user_sender",
  foreignKey: {
    name: "fk_user_sender",
    allowNull: false
  },
  targetKey: "user_id"
});

// User receiver
User.hasMany(Transfer, {
  foreignKey: {
    name: "fk_user_receiver",
    allowNull: false
  },
  sourceKey: "user_id"
});
Transfer.belongsTo(User, {
  as: "user_receiver",
  foreignKey: {
    name: "fk_user_receiver",
    allowNull: false
  },
  targetKey: "user_id"
});

// Shop sender
Shop.hasMany(Transfer,  {
  foreignKey: {
    name: "fk_shop_sender",
    allowNull: false
  },
  sourceKey: "shop_id"
});
Transfer.belongsTo(Shop, {
  as: "shop_sender",
  foreignKey: {
    name: "fk_shop_sender",
    allowNull: false
  },
  targetKey: "shop_id"
});

// Shop receiver
Shop.hasMany(Transfer,  {
  foreignKey: {
    name: "fk_shop_receiver",
    allowNull: false
  },
  sourceKey: "shop_id"
});
Transfer.belongsTo(Shop, {
  as: "shop_receiver",
  foreignKey: {
    name: "fk_shop_receiver",
    allowNull: false
  },
  targetKey: "shop_id"
});


//shop & cash register
Shop.hasMany(CashRegister, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  sourceKey: "shop_id"
});
CashRegister.belongsTo(Shop, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  targetKey: "shop_id"
});


/**
 * @summary: cart & seller & customer & payment & product
 */
// Seller
User.hasMany(Cart, {
  foreignKey: {
    name: "fk_seller",
    allowNull: false
  },
  sourceKey: "user_id"
});
Cart.belongsTo(User, {
  as: "seller",
  foreignKey: {
    name: "fk_seller",
    allowNull: false
  },
  targetKey: "user_id"
});

// Customer
User.hasMany(Cart, {
  foreignKey: {
    name: "fk_customer",
    allowNull: true
  },
  sourceKey: "user_id"
});
Cart.belongsTo(User, {
  as: "customer",
  foreignKey: {
    name: "fk_customer",
    allowNull: true
  },
  targetKey: "user_id"
});

// Shop
Shop.hasMany(Cart, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  sourceKey: "shop_id"
});
Cart.belongsTo(Shop, {
  foreignKey: {
    name: "fk_shop_id",
    allowNull: false
  },
  targetKey: "shop_id"
});

// Payment
Payment.hasMany(Cart, {
  foreignKey: {
    name: "fk_payment_id",
    allowNull: false
  },
  sourceKey: "payment_id"
});
Cart.belongsTo(Payment, {
  foreignKey: {
    name: "fk_payment_id",
    allowNull: false
  },
  targetKey: "payment_id"
});

// Product
Product.belongsToMany(
  Cart,
  {
    through: CartProduct,
    foreignKey: {
      name: "product_id",
      allowNull: false
    }
  }
);
Cart.belongsToMany(
  Product,
  {
    through: CartProduct,
    foreignKey: {
      name: "cart_id",
      allowNull: false
    }
  }
);



module.exports = { 
  Company, 
  Shop, 
  Category, 
  Product,
  Price,
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
  AuthorizationRole,
  TransferStatus,
  Transfer,
  TransferType,
  TransferProduct,
  TransferSerialization,
  CashRegister,
  Payment,
  Cart,
  CartProduct
};