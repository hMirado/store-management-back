import express, { Express } from "express";
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db.config");
const companyRoutes = require("./routes/company.route");
const shopRoutes = require("./routes/shop.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");
const attributeRouter = require("./routes/attribute.route");
const stockRouter = require("./routes/stock.route");
const userRouer = require("./routes/user.route");
const authRoute = require("./routes/authentication.route");
const typeRoute = require("./routes/serialization-type.route");
const serializationRoute = require("./routes/serialization.route");
const attributeTypeRoute = require("./routes/attribute-type.route");
const transferRoute = require("./routes/transfer.route");
const roleRoute = require("./routes/role.route");
const priceRoute = require("./routes/price.route");
const saleRoute = require("./routes/sale.route");
const fileRoute = require("./routes/file.route");
const sessionRoute = require("./routes/session.route");
const Seed = require("./seeds/index");

const app: Express = express();

app.use(bodyParser.json({limit: '50000mb'}));
app.use(bodyParser.urlencoded({limit: '50000mb', parameterLimit: 100000000, extended: true}))
app.use(cors());

sequelize.sync({ alter: false , force: false });

// sequelize
//   .sync({ force: true })
//   .then(() => Seed())
//   .then(() => console.log("\nDrop and resync db.\n"))
//   .catch((error: Error) => console.log("\nERROR : \n", error));

app.use("/company", companyRoutes);
app.use("/shop", shopRoutes);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/attribute", attributeRouter);
app.use("/stock", stockRouter);
app.use("/user", userRouer);
app.use("/authentication", authRoute);
app.use("/type", typeRoute);
app.use("/serialization", serializationRoute);
app.use("/attribute-type", attributeTypeRoute);
app.use("/transfer", transferRoute);
app.use("/role", roleRoute);
app.use("/price", priceRoute);
app.use("/sale", saleRoute);
app.use("/file", fileRoute);
app.use("/session", sessionRoute);

const port = process.env.PORT;
app.listen(port, () => {
	return console.log(`\n\nExpress is listening at http://localhost:${port}\n\n`);
});

// domains/planetgame.mg/public_html/store-management-api
