import express from "express";
import { fetchTrends } from "../controllers/trends.controllers.js";

const fetchRoutes = express.Router();

fetchRoutes.get("/fetch-trends", fetchTrends);

export default fetchRoutes;
