import express from "express";
import movieRoutes from "./movieRoutes.js";
import assetRoutes from "./assetRoutes.js";

const router = express.Router();

router.use("/movies", movieRoutes);
router.use("/asset", assetRoutes);

export default router;
