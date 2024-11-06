import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const saveFile = async (buffer, fileName) => {
  let uniqueFileName = uuidv4();
  let extension = fileName.split(".").pop();
  uniqueFileName = uniqueFileName + "." + extension;
  const fileBuffer = Buffer.from(buffer.split(",")[1], "base64");

  return await new Promise((resolve, reject) => {
    fs.writeFile("public/" + uniqueFileName, fileBuffer, (err) => {
      if (err) {
        console.error("An error occurred:", err);
        reject();
      } else {
        resolve(
          `${process.env.SERVER_API_URL}/api/asset/get-file/${uniqueFileName}`
        );
      }
    });
  });
};

export class AssetController {
  static async uploadFile(req, res) {
    let { file, fileName } = req.body;

    // get file size
    const fileBuffer = Buffer.from(file, "base64");
    const fileSizeInBytes = fileBuffer.length;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;

    if (fileSizeInMB > 10) {
      return res.json({
        success: false,
        error: "File size should not exceed 10MB.",
      });
    }

    let originalFileName = fileName;

    // remove all spaces from file name
    fileName = fileName.replace(/\s/g, "");

    // to lowercase
    fileName = fileName.toLowerCase();

    // check file type
    const fileType = fileName.split(".").pop();
    if (!["png", "jpg", "jpeg"].includes(fileType)) {
      return res.json({
        success: false,
        error: "Only png, jpg and jpeg files are allowed.",
      });
    }

    try {
      const url = await saveFile(file, fileName);

      return res.json({
        success: true,
        srcUrl: url,
      });
    } catch (error) {
      // Handle any errors that occur during the file saving process
      return res.status(500).json({
        success: false,
        error: "An error occurred while saving the file.",
      });
    }
  }

  static getFile(req, res) {
    const fileName = req.params.name;
    const filePath = join(__dirname, "../../public/" + fileName);
    res.sendFile(filePath);
  }
}
