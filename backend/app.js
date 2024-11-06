import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ejs from "ejs";
import appRoutes from "./src/routes/index.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.static("public"));
app.set("views", join(__dirname, "public"));
app.engine("html", ejs.renderFile);

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/api/status", (req, res) => {
  return res.json({
    success: true,
    message: "Server status is good",
  });
});

app.use("/api", appRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
