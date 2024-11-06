import express from "express";

import { AssetController } from "../controllers/index.js";

const router = express.Router();

router.get("/get-file/:name", AssetController.getFile);
router.post("/upload", AssetController.uploadFile);

export default router;
