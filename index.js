import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoute from "./routes/Route.js";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/public/img", express.static("public/img"));
app.use(ProductRoute);
app.listen(process.env.APP_PORT, () => {
  console.log("server up and running");
});
