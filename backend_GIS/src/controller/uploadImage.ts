import { Request, Response } from "express";
import multer from "multer";
import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../utils/s3";

const upload = multer({ storage: multer.memoryStorage() });

// // Middleware untuk menerima multiple file (maks 10 file)
export const uploadFotoMiddleware = upload.single("fotopersil");

export const PostFotoPersil = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const nop = req.params.nop;
    const forceName = req.query.forceName as string | undefined;
    const currentCount = parseInt(req.query.count as string) || 0;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!file) return res.status(400).json({ message: "tidak ada foto yang diupload" });
    if (!/^\d{18}$/.test(nop)) return res.status(400).json({ message: `Invalid NOP format: ${nop}` });

    const extension = file.originalname.split(".").pop();
    let filename: string;

    if (forceName) {
      // ⬇ Jika ada forceName, langsung gunakan
      filename = `${forceName}.${extension}`;
    } else {
      // ⬇ Hitung jumlah foto dengan prefix `fotopersil/NOP_`
      const prefix = `fotopersil/${nop}_`;
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      });
      const listResult = await s3.send(listCommand);
      const existingCount = listResult.Contents?.length || 0;

      if (existingCount >= 2) {
        return res.status(400).json({ message: `NOP ${nop} sudah memiliki 2 foto.` });
      }

      const photoNumber = currentCount + 1;
      filename = `${nop}_${photoNumber}.${extension}`;
    }

    const key = `fotopersil/${filename}`;

    // ⬇ Cek apakah file sudah ada, hanya kalau **tidak forceName**
    if (!forceName) {
      try {
        await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
        // Kalau berhasil, berarti file sudah ada
        return res.status(400).json({ message: `File ${filename} sudah ada di bucket.` });
      } catch (err: any) {
        if (err.name !== "NotFound") throw err; // error lain selain NotFound
      }
    }

    // ⬇ Upload file ke S3 (overwrite jika perlu)
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(putCommand);

    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrls: [imageUrl],
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
