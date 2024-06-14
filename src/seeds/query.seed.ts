export {}
const sequelize = require("../config/db.config");

module.exports = {
  up: () => {
    sequelize.query(`
      DROP TRIGGER IF EXISTS stock_movments_insert;

      DELIMITER $$

      CREATE TRIGGER stock_movments_insert

      AFTER INSERT 
      ON stock_movments FOR EACH ROW 

      BEGIN
        DECLARE id integer;
        DECLARE typeId varchar(255);
        
        SELECT movment INTO typeId FROM stock_movment_types smt WHERE smt.stock_movment_type_id = NEW.fk_stock_movment_type_id;
        IF typeId = 'IN-IMPORT' OR typeId = 'CANCEL-SELL' THEN
          SELECT COUNT(*) INTO id FROM stocks s WHERE s.fk_shop_id = NEW.fk_shop_id AND s.fk_product_id = NEW.fk_product_id;
          IF  id = 0 OR id = NULL  THEN
              INSERT INTO stocks (stock_uuid, quantity, createdAt, updatedAt, fk_shop_id, fk_product_id)
              VALUES (UUID(), NEW.quantity, NEW.createdAt, NEW.updatedAt, NEW.fk_shop_id, NEW.fk_product_id);
          ELSE 
            UPDATE stocks s SET s.quantity = s.quantity + NEW.quantity WHERE s.fk_shop_id = NEW.fk_shop_id AND s.fk_product_id = NEW.fk_product_id;
          END IF;
        ELSEIF typeId = 'OUT-TRANSFER' OR typeId = 'OUT-SELL' THEN
          UPDATE stocks s SET s.quantity  = s.quantity  - NEW.quantity WHERE s.fk_shop_id = NEW.fk_shop_id AND s.fk_product_id = NEW.fk_product_id;
        ELSEIF typeId = 'IN-TRANSFER' THEN
          SELECT COUNT(*) INTO id FROM stocks s WHERE s.fk_shop_id = NEW.fk_shop_id AND s.fk_product_id = NEW.fk_product_id;
          IF  id = 0 OR id = NULL  THEN
              INSERT INTO stocks (stock_uuid, quantity, createdAt, updatedAt, fk_shop_id, fk_product_id)
              VALUES (UUID(), NEW.quantity, NEW.createdAt, NEW.updatedAt, NEW.fk_shop_id, NEW.fk_product_id);
          ELSE 
            UPDATE stocks s SET s.quantity = s.quantity + NEW.quantity WHERE s.fk_shop_id = NEW.fk_shop_id AND s.fk_product_id = NEW.fk_product_id;
          END IF;
        END IF;
      END$$

      DELIMITER ;
    `);
  },

  down: () => {
    sequelize.query(`
      DROP TRIGGER stock_movments_insert
    `);
  }
};