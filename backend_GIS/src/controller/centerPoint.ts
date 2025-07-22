import { AppDataSource } from "../data-resource";
import { centerPoint } from "../entity/centerPoint";
import { Request, Response } from "express";

export const retrieveCenterPoint = async (req: Request, res: Response) => {
  try {
    const centerPointRepo = AppDataSource.getRepository(centerPoint);
    const latlong = await centerPointRepo.findOne({ where: {} });

    if (latlong === null) {
      return res.status(404).json({
        code: 404,
        message: "Center Point kosong!!!",
      });
    }

    return res.status(200).json({
      code: 200,
      data: latlong,
      message: "titik center point berhasil diambil",
    });
  } catch (error) {
    console.error("Error mendaftar akun:", error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

export const updateCenterPoint = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({
        code: 400,
        message: "Latitude dan longitude harus diisi",
      });
    }

    const centerPointRepo = AppDataSource.getRepository(centerPoint);
    // Cari data center point yang ada (asumsi hanya ada 1 record)
    const existingCenterPoint = await centerPointRepo.findOne({ where: {} });

    if (existingCenterPoint) {
      // Update data yang ada
      existingCenterPoint.LATITUDE = latitude;
      existingCenterPoint.LONGITUDE = longitude;
      await centerPointRepo.save(existingCenterPoint);
    } else {
      // Buat baru jika tidak ada data
      const newCenterPoint = centerPointRepo.create({
        LATITUDE: latitude,
        LONGITUDE: longitude,
      });
      await centerPointRepo.save(newCenterPoint);
    }

    return res.status(200).json({
      code: 200,
      data: { latitude, longitude },
      message: "Center point berhasil diupdate",
    });
  } catch (error) {
    console.error("Error mendaftar akun:", error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};
