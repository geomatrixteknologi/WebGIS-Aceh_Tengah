import { Request, Response } from "express";
import { AppDataSource } from "@/data-resource";
import { BatasKelurahan } from "@/entity/batasKelurahan";
import { BatasPersil } from "@/entity/batasPersil";
import { BatasZNT } from "@/entity/batasZNT";
import { BatasBlok } from "@/entity/batasBlok";

export const getBatasKelurahan = async (req: Request, res: Response) => {
  try {
    const kelurahanRepo = AppDataSource.getRepository(BatasKelurahan);

    // Cek apakah ada data di dalam tabel
    const count = await kelurahanRepo.count();
    if (count === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data tidak tersedia",
      });
    }

    // Ambil semua data dari tabel batas_kelurahan
    const batasData = await kelurahanRepo
      .createQueryBuilder("batas")
      .select([
        "ST_AsGeoJSON(batas.geom) as geometry", // Ambil geometri dalam format GeoJSON
        "batas.KD_PROV",
        "batas.KD_KAB",
        "batas.KD_KEC",
        "batas.KD_KEL",
        "batas.NM_KEL",
      ])
      .getRawMany();

    // Konversi hasil query ke format GeoJSON
    const geojson = {
      data: batasData.map((data: any) => ({
        type: "Feature",
        properties: {
          KD_PROV: data.batas_KD_PROV,
          KD_KAB: data.batas_KD_KAB,
          KD_KEC: data.batas_KD_KEC,
          KD_KEL: data.batas_KD_KEL,
          NM_KEL: data.batas_NM_KEL,
        },
        geometry: JSON.parse(data.geometry), // Parsing string GeoJSON menjadi objek
      })),
    };

    return res.status(200).json({
      code: 200,
      data: geojson.data,
      message: "Data batas kelurahan berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data batas kelurahan:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const getBatasPersil = async (req: Request, res: Response) => {
  try {
    const persilRepo = AppDataSource.getRepository(BatasPersil);

    // Cek apakah ada data di dalam tabel
    const count = await persilRepo.count();
    if (count === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data tidak tersedia",
      });
    }

    // Ambil semua data dari tabel batas_persil
    const batasData = await persilRepo
      .createQueryBuilder("batas")
      .select([
        "ST_AsGeoJSON(batas.geom) as geometry", // Ambil geometri dalam format GeoJSON
        "batas.KD_PROV",
        "batas.KD_KAB",
        "batas.KD_KEC",
        "batas.KD_KEL",
        "batas.KD_BLOK",
        "batas.NO_URUT",
        "batas.KD_JNS_OP",
        "batas.FOTO_PERSIL",
      ])
      .getRawMany();

    // Konversi hasil query ke format GeoJSON
    const geojson = {
      data: batasData.map((data: any) => ({
        type: "Feature",
        properties: {
          KD_PROV: data.batas_KD_PROV,
          KD_KAB: data.batas_KD_KAB,
          KD_KEC: data.batas_KD_KEC,
          KD_KEL: data.batas_KD_KEL,
          KD_BLOK: data.batas_KD_BLOK,
          NO_URUT: data.batas_NO_URUT,
          KD_JNS_OP: data.batas_KD_JNS_OP,
          FOTO_PERSIL: data.batas_FOTO_PERSIL,
        },
        geometry: JSON.parse(data.geometry), // Parsing string GeoJSON menjadi objek
      })),
    };

    return res.status(200).json({
      code: 200,
      data: geojson.data,
      message: "Data batas persil berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data batas persil:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const getBatasZNT = async (req: Request, res: Response) => {
  try {
    const zntRepo = AppDataSource.getRepository(BatasZNT);

    // Cek apakah ada data di dalam tabel
    const count = await zntRepo.count();
    if (count === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data tidak tersedia",
      });
    }

    // Ambil semua data dari tabel batas_persil
    const batasData = await zntRepo
      .createQueryBuilder("batas")
      .select([
        "ST_AsGeoJSON(batas.geom) as geometry", // Ambil geometri dalam format GeoJSON
        "batas.KD_PROV",
        "batas.KD_KAB",
        "batas.KD_KEC",
        "batas.KD_KEL",
        "batas.KD_ZNT",
        "batas.TAHUN",
        "batas.NIR_EKS",
        "batas.NIR_ANAL",
        "batas.KLS_EKS",
        "batas.KLS_ANAL",
        "batas.LABEL_EKS",
        "batas.LABEL_ANAL",
      ])
      .getRawMany();

    // Konversi hasil query ke format GeoJSON
    const geojson = {
      data: batasData.map((data: any) => ({
        type: "Feature",
        properties: {
          KD_PROV: data.batas_KD_PROV,
          KD_KAB: data.batas_KD_KAB,
          KD_KEC: data.batas_KD_KEC,
          KD_KEL: data.batas_KD_KEL,
          KD_ZNT: data.batas_KD_ZNT,
          TAHUN: data.batas_TAHUN,
          NIR_EKS: data.batas_NIR_EKS,
          NIR_ANAL: data.batas_NIR_ANAL,
          KLS_EKS: data.batas_KLS_EKS,
          KLS_ANAL: data.batas_KLS_ANAL,
          LABEL_EKS: data.batas_LABEL_EKS,
          LABEL_ANAL: data.batas_LABEL_ANAL,
        },
        geometry: JSON.parse(data.geometry), // Parsing string GeoJSON menjadi objek
      })),
    };

    return res.status(200).json({
      code: 200,
      data: geojson.data,
      message: "Data batas ZNT berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data batas ZNT:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const getBatasBlok = async (req: Request, res: Response) => {
  try {
    const blokRepo = AppDataSource.getRepository(BatasBlok);

    // Cek apakah ada data di dalam tabel
    const count = await blokRepo.count();
    if (count === 0) {
      return res.status(404).json({
        code: 404,
        message: "Data tidak tersedia",
      });
    }

    // Ambil semua data dari tabel batas_blok
    const batasData = await blokRepo
      .createQueryBuilder("batas")
      .select([
        "ST_AsGeoJSON(batas.geom) as geometry", // Ambil geometri dalam format GeoJSON
        "batas.KD_PROV",
        "batas.KD_KAB",
        "batas.KD_KEC",
        "batas.KD_KEL",
        "batas.KD_BLOK",
      ])
      .getRawMany();

    // Konversi hasil query ke format GeoJSON
    const geojson = {
      data: batasData.map((data: any) => ({
        type: "Feature",
        properties: {
          KD_PROV: data.batas_KD_PROV,
          KD_KAB: data.batas_KD_KAB,
          KD_KEC: data.batas_KD_KEC,
          KD_KEL: data.batas_KD_KEL,
          KD_BLOK: data.batas_KD_BLOK,
        },
        geometry: JSON.parse(data.geometry), // Parsing string GeoJSON menjadi objek
      })),
    };

    return res.status(200).json({
      code: 200,
      data: geojson.data,
      message: "Data batas Blok berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data batas Blok:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
