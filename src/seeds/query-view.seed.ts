export {}
const sequelize = require("../config/db.config");

module.exports  = () => {
  return sequelize.query(`
    CREATE OR REPLACE VIEW get_sales AS
    SELECT
      s.sale_id,
      s.sale_uuid,
      s.discount,
      s.createdAt,
      s.deletedAt,
      s.serialization,
      sh.shop_uuid,
      sh.shop_name,
      p.code,
      p.label,
      c.category_uuid,
      c.label AS category,
      pr.price_id,
      pr.ttc_price
    FROM
      sales AS s
    LEFT OUTER JOIN shops AS sh ON
      s.fk_shop_id = sh.shop_id
      AND sh.deletedAt IS NULL
    LEFT OUTER JOIN products AS p ON
      (s.fk_product_id = p.product_id
      AND p.deletedAt IS NULL)
    INNER JOIN categories AS c ON p.fk_category_id = c.category_id
    INNER JOIN prices AS pr ON
      p.product_id = pr.fk_product_id
      AND s.fk_shop_id = pr.fk_shop_id
      AND pr.deletedAt IS NULL
    ;
  `);
};