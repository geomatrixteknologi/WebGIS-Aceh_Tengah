import multer from "multer";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Konfigurasi storage dengan diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { kecamatan, kelurahan, jenis } = req.body;
    const uploadDir = path.join(__dirname, `../../public/${jenis}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const { kecamatan, kelurahan, jenis } = req.body;
    if (!kecamatan || !jenis) {
      return cb(new Error("Kecamatan and Jenis are required"), "");
    }
    const ext = path.extname(file.originalname); // Dapatkan ekstensi file
    const filename = `${kecamatan}_${kelurahan || "XX"}_${jenis}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export const uploadMiddleware = upload.fields([
  { name: "shp", maxCount: 1 },
  { name: "dbf", maxCount: 1 },
]);

export const validateUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !("shp" in req.files) || !("dbf" in req.files)) {
    return res.status(400).json({ message: "Both .shp and .dbf files are required" });
  }
  next();
};
