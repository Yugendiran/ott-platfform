import express from "express";

import { MovieController } from "../controllers/index.js";

const router = express.Router();

router.get("/", MovieController.getMovies);
router.get("/:movieId", MovieController.getMovie);
router.post("/", MovieController.createMovie);
router.put("/:movieId", MovieController.updateMovie);
router.delete("/:movieId", MovieController.deleteMovie);

export default router;
