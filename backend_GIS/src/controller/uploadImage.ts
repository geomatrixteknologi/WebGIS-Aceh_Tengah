import { Request, Response } from "express";
import { AppDataSource } from "../data-resource";
import { BatasPersil } from "../entity/batasPersil";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";
import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../utils/s3";

const upload = multer({ storage: multer.memoryStorage() });

// // Middleware untuk menerima multiple file (maks 10 file)
export const uploadFotoMiddleware = upload.single("fotopersil");

// export const PostFotoPersil = async (req: Request, res: Response) => {
//   try {
//     if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//     const persilRepo = AppDataSource.getRepository(BatasPersil);
//     let uploadedImages: string[] = [];

//     // Menggunakan Promise.all agar semua file diproses sekaligus
//     await Promise.all(
//       (req.files as Express.Multer.File[]).map(async (file) => {
//         const fileName = file.originalname.split(".")[0]; // Ambil nama file tanpa ekstensi
//         const fileExtension = file.originalname.split(".").pop(); // Ambil ekstensi file

//         if (!/^\d{18}$/.test(fileName)) {
//           throw new Error(`Invalid filename format: ${file.originalname}`);
//         }

//         // Pisahkan NOP ke dalam bagian-bagian untuk pencocokan
//         const KD_PROV = fileName.substring(0, 2);
//         const KD_KAB = fileName.substring(2, 4);
//         const KD_KEC = fileName.substring(4, 7);
//         const KD_KEL = fileName.substring(7, 10);
//         const KD_BLOK = fileName.substring(10, 13);
//         const NO_URUT = fileName.substring(13, 17);
//         const KD_JNS_OP = fileName.substring(17, 18);

//         // Cari batas persil berdasarkan NOP
//         let batasPersil = await persilRepo.findOne({
//           where: { KD_PROV, KD_KAB, KD_KEC, KD_KEL, KD_BLOK, NO_URUT, KD_JNS_OP },
//         });

//         if (!batasPersil) {
//           throw new Error(`NOP ${fileName} not found in database`);
//         }

//         if (batasPersil.FOTO_PERSIL !== null && batasPersil.FOTO_PERSIL.length >= 3) {
//           throw new Error(`NOP ${fileName} already has 3 photos. Upload not allowed.`);
//         }

//         // Jika batasPersil sudah memiliki foto, buat numbering
//         let uploadCount = batasPersil.FOTO_PERSIL ? batasPersil.FOTO_PERSIL.length : 0;
//         const cloudinaryFileName = `${fileName}_${uploadCount + 1}.${fileExtension}`;

//         // Fungsi untuk mengupload ke Cloudinary dan mengembalikan URL
//         const uploadImageToCloudinary = (): Promise<string> => {
//           return new Promise((resolve, reject) => {
//             const uploadStream = cloudinary.uploader.upload_stream(
//               {
//                 folder: "fotopersil",
//                 public_id: cloudinaryFileName,
//                 transformation: [
//                   { width: 720, height: 400, crop: "fill" }, // Resize to 720x400 and crop to fit
//                   { quality: "auto:good" }, // Auto compression (can use "auto:eco" for better compression)
//                   { format: "webp" }, // Convert to WebP for smaller file size
//                 ],
//               },
//               async (error, result) => {
//                 if (error) {
//                   console.error("Cloudinary upload error:", error);
//                   reject(error);
//                 } else {
//                   resolve(result?.secure_url || "");
//                 }
//               }
//             );
//             streamifier.createReadStream(file.buffer).pipe(uploadStream);
//           });
//         };

//         // Upload gambar ke Cloudinary
//         const imageUrl = await uploadImageToCloudinary();

//         // Tambahkan URL gambar ke dalam array
//         uploadedImages.push(imageUrl);

//         if (!Array.isArray(batasPersil.FOTO_PERSIL)) {
//           batasPersil.FOTO_PERSIL = batasPersil.FOTO_PERSIL ? JSON.parse(batasPersil.FOTO_PERSIL as unknown as string) : [];
//         }

//         batasPersil.FOTO_PERSIL?.push(imageUrl);

//         await persilRepo.save(batasPersil);
//       })
//     );

//     // Kirim respons setelah semua file berhasil di-upload
//     return res.status(200).json({
//       message: "Images uploaded successfully",
//       imageUrls: uploadedImages,
//     });
//   } catch (error: any) {
//     console.error("Error uploading images:", error);
//     return res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };

// export const PostFotoPersil = async (req: Request, res: Response) => {
//   try {
//     const file = req.file;
//     const nop = req.params.nop;
//     const currentCount = parseInt(req.query.count as string) || 0;
//     const bucketName = process.env.AWS_S3_BUCKET_NAME;

//     if (!file) return res.status(400).json({ message: "tidak ada foto yang diupload" });
//     if (!/^\d{18}$/.test(nop)) return res.status(400).json({ message: `Invalid NOP format: ${nop}` });
//     const prefix = `fotopersil/${nop}_`;

//     // Cek jumlah file dengan prefix tersebut di bucket
//     const listCommand = new ListObjectsV2Command({
//       Bucket: bucketName,
//       Prefix: prefix,
//     });

//     const listResult = await s3.send(listCommand);
//     const existingCount = listResult.Contents?.length || 0;

//     if (existingCount >= 2) {
//       return res.status(400).json({ message: `NOP ${nop} sudah memiliki 2 foto.` });
//     }

//     const extension = file.originalname.split(".").pop();
//     const photoNumber = currentCount + 1;
//     const filename = `${nop}_${photoNumber}.${extension}`;
//     const key = `fotopersil/${filename}`;

//     // Upload ke S3
//     const command = new PutObjectCommand({
//       Bucket: bucketName,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//       // ACL: "public-read",
//     });

//     await s3.send(command);

//     const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

//     return res.status(200).json({
//       message: "Image uploaded successfully",
//       imageUrls: [imageUrl],
//     });
//   } catch (error: any) {
//     console.error("Upload error:", error);
//     return res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };

// export const PostFotoPersil = async (req: Request, res: Response) => {
//   try {
//     const file = req.file;
//     const nop = req.params.nop;
//     const currentCount = parseInt(req.query.count as string) || 0;
//     const bucketName = process.env.AWS_S3_BUCKET_NAME;

//     if (!file) return res.status(400).json({ message: "tidak ada foto yang diupload" });
//     if (!/^\d{18}$/.test(nop)) return res.status(400).json({ message: `Invalid NOP format: ${nop}` });

//     const prefix = `fotopersil/${nop}_`;

//     // ✅ Cek jumlah file yang sudah ada dengan prefix NOP_ di bucket
//     const listCommand = new ListObjectsV2Command({
//       Bucket: bucketName,
//       Prefix: prefix,
//     });

//     const listResult = await s3.send(listCommand);
//     const existingCount = listResult.Contents?.length || 0;

//     if (existingCount >= 2) {
//       return res.status(400).json({ message: `NOP ${nop} sudah memiliki 2 foto.` });
//     }

//     // ✅ Penamaan file: NOP_x.jpg
//     const extension = file.originalname.split(".").pop();
//     const photoNumber = currentCount + 1;
//     const filename = `${nop}_${photoNumber}.${extension}`;
//     const key = `fotopersil/${filename}`;

//     // ✅ Cek apakah file dengan nama tersebut sudah ada di S3
//     try {
//       await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
//       // Jika berhasil, berarti file sudah ada
//       return res.status(400).json({ message: `File ${filename} sudah ada di bucket.` });
//     } catch (error: any) {
//       if (error.name !== "NotFound") {
//         // Jika error bukan NotFound, lempar error
//         throw error;
//       }
//       // File tidak ditemukan, lanjutkan upload
//     }

//     // ✅ Upload file ke S3
//     const putCommand = new PutObjectCommand({
//       Bucket: bucketName,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     });

//     await s3.send(putCommand);

//     const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

//     return res.status(200).json({
//       message: "Image uploaded successfully",
//       imageUrls: [imageUrl],
//     });
//   } catch (error: any) {
//     console.error("Upload error:", error);
//     return res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };

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
      const prefix = `fotopersil_aceh-tengah/${nop}_`;
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

    const key = `fotopersil_aceh-tengah/${filename}`;

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
