import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fetchRoutes from "./routes/trends.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DB_LOCATION)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api", fetchRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is running at port: ${process.env.PORT}`);
});
