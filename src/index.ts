import express, { Express } from "express";
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db.config.ts");
const companyRoutes = require("./routes/company.route");
const shopRoutes = require("./routes/shop.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");
const attributeRouter = require("./routes/attribute.route");
const stockRouter = require("./routes/stock.route");
const userRouer = require("./routes/user.route");
const authRoute = require("./routes/authentication.route");
const typeRoute = require("./routes/serialization-type.route");
const attributeTypeRoute = require("./routes/attribute-type.route");
const Seed = require("./seeds/index");

const app: Express = express();
app.use(
	bodyParser.json({
		limit: "30mb",
		extends: true,
	})
);
app.use(
	bodyParser.urlencoded({
		limit: "30mb",
		extends: true,
	})
);
app.use(cors());

sequelize.sync({ alter: true });

/*sequelize
  .sync({ force: true })
  .then(() => Seed())
  .then(() => {
    console.log("\nDrop and resync db.\n");
  })
  .catch((error: Error) => {
    console.log("\nERROR : \n");
    console.log(error);
  });*/

app.use("/company", companyRoutes);
app.use("/shop", shopRoutes);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/attribute", attributeRouter);
app.use("/stock", stockRouter);
app.use("/user", userRouer);
app.use("/authentication", authRoute);
app.use("/type", typeRoute);
app.use("/attribute-type", attributeTypeRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => {
	return console.log(`\nExpress is listening at http://localhost:${port}\n`);
});
