import { Request, Response } from "express";
import { open } from "shapefile";
import proj4 from "proj4";
import { AppDataSource } from "../data-resource";
import { BatasKelurahan } from "../entity/batasKelurahan";
import { BatasPersil } from "../entity/batasPersil";
import path from "path";
import { BatasZNT } from "../entity/batasZNT";
import { BatasBlok } from "../entity/batasBlok";

// Definisi proyeksi UTM Zona 50S (EPSG:32750) dan WGS84 (EPSG:4326)
const utm50s = "+proj=utm +zone=50 +south +datum=WGS84 +units=m +no_defs";
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

export const PostShpKelurahan = async (req: Request, res: Response) => {
  try {
    const { kecamatan, kelurahan, jenis } = req.body;
    const filePath = path.join(__dirname, "../../public/kelurahan", `${kecamatan}_${kelurahan || "XX"}_${jenis}.shp`);

    const source = await open(filePath);
    const kecamatanNew = kecamatan.split(" - ")[0];

    const kelurahanRepo = AppDataSource.getRepository(BatasKelurahan);

    // pastikan KD_PROV dan KD_KAB sesuai dengan project yang dijalankan
    const refData: Record<string, string> = {
      KD_PROV: "62",
      KD_KAB: "13",
      KD_KEC: kecamatanNew,
    };

    const geojsonFeatures: any[] = [];

    let result;
    do {
      result = await source.read();
      if (!result.done) {
        const { properties, geometry } = result.value;
        if (!geometry) continue;

        if (!properties) {
          return res.status(400).json({ code: 400, message: "Data properties tidak ditemukan dalam file SHP" });
        }

        const requiredFields = [
          { key: "KD_PROV", label: "Kode Provinsi" },
          { key: "KD_KAB", label: "Kode Kabupaten" },
          { key: "KD_KEC", label: "Kode Kecamatan" },
          { key: "KD_KEL", label: "Kode Kelurahan" },
          { key: "NM_KEL", label: "Nama Kelurahan" },
        ];

        for (const { key, label } of requiredFields) {
          if (!properties[key]) {
            return res.status(400).json({ code: 400, message: `${label} tidak boleh kosong` });
          }

          if (refData[key] && properties[key] !== refData[key]) {
            return res.status(400).json({ code: 400, message: `${label} di poligon tidak sesuai` });
          }
        }

        let convertedCoordinates;
        switch (geometry.type) {
          case "Point":
            convertedCoordinates = proj4(utm50s, wgs84, geometry.coordinates);
            break;
          case "Polygon":
            convertedCoordinates = geometry.coordinates.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point)));
            break;
          case "MultiPolygon":
            convertedCoordinates = geometry.coordinates.map((polygon: any) => polygon.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point))));
            break;
          default:
            console.warn(`Geometry type ${geometry.type} is not supported`);
            continue;
        }

        if (!convertedCoordinates || convertedCoordinates.length === 0) {
          console.warn(`Geometri tidak valid untuk ${properties?.NM_KEL}`);
          continue;
        }

        const geoJsonData = {
          type: geometry.type,
          coordinates: convertedCoordinates,
        };

        geojsonFeatures.push({
          type: "Feature",
          properties: {
            KD_PROV: properties?.KD_PROV,
            KD_KAB: properties?.KD_KAB,
            KD_KEC: properties?.KD_KEC,
            KD_KEL: properties?.KD_KEL,
            NM_KEL: properties?.NM_KEL,
          },
          geometry: geoJsonData,
        });
      }
    } while (!result.done);

    // Jika tidak ada data valid, hentikan proses
    if (geojsonFeatures.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Tidak ada data valid yang bisa disimpan",
      });
    }

    // Setelah validasi selesai, hapus data lama
    const existingData = await kelurahanRepo.find({
      where: { KD_KEC: kecamatanNew },
    });

    if (existingData.length > 0) {
      console.log(`Deleting existing records for Kecamatan: ${kecamatanNew}`);
      await kelurahanRepo.delete({ KD_KEC: kecamatanNew });
    }

    // Simpan data yang sudah valid ke dalam database
    for (const feature of geojsonFeatures) {
      const { properties, geometry } = feature;

      await kelurahanRepo
        .createQueryBuilder()
        .insert()
        .into(BatasKelurahan)
        .values({
          KD_PROV: properties.KD_PROV,
          KD_KAB: properties.KD_KAB,
          KD_KEC: properties.KD_KEC,
          KD_KEL: properties.KD_KEL,
          NM_KEL: properties.NM_KEL,
        })
        .execute();

      await kelurahanRepo
        .createQueryBuilder()
        .update(BatasKelurahan)
        .set({
          geom: () => `ST_GeomFromGeoJSON('${JSON.stringify(geometry)}')`,
        })
        .where("KD_KEL = :KD_KEL", { KD_KEL: properties.KD_KEL })
        .execute();
    }

    return res.status(200).json({
      code: 200,
      message: "File SHP berhasil dikonversi dan disimpan ke database",
    });
  } catch (error) {
    console.error("Error membaca file SHP:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const PostShpPersil = async (req: Request, res: Response) => {
  try {
    const { kecamatan, kelurahan, jenis } = req.body;
    const filePath = path.join(__dirname, "../../public/persil", `${kecamatan}_${kelurahan || "XX"}_${jenis}.shp`);

    const source = await open(filePath);
    const persilRepo = AppDataSource.getRepository(BatasPersil);

    const kecamatanNew = kecamatan.split(" - ")[0];
    const kelurahanNew = kelurahan.split(" - ")[0];

    // pastikan KD_PROV dan KD_KAB sesuai dengan project yang dijalankan
    const refData: Record<string, string> = {
      KD_PROV: "62",
      KD_KAB: "13",
      KD_KEC: kecamatanNew,
      KD_KEL: kelurahanNew,
    };

    const geojsonFeatures: any[] = [];
    const batchInsertData: any[] = [];
    const batchUpdateData: { id?: number; geoJsonData: string }[] = [];
    const uniqueSet = new Set<string>();

    let result;
    do {
      result = await source.read();
      if (!result.done) {
        const { properties, geometry } = result.value;
        if (!geometry) continue;

        if (!properties) {
          return res.status(400).json({ code: 400, message: "Data properties tidak ditemukan dalam file SHP" });
        }

        // pengecekan "KD_PROV", "KD_KAB", "KD_KEC", "KD_KEL", "KD_BLOK", "KD_JNS_OP" tidak boleh null
        const requiredFields = ["KD_PROV", "KD_KAB", "KD_KEC", "KD_KEL", "KD_BLOK", "KD_JNS_OP"];
        for (const key of requiredFields) {
          if (!properties[key]) {
            return res.status(400).json({ code: 400, message: `${key} tidak boleh kosong` });
          }
        }

        // pengecekan "KD_PROV", "KD_KAB", "KD_KEC", "KD_KEL" harus ssuai dengan input
        for (const key of ["KD_PROV", "KD_KAB", "KD_KEC", "KD_KEL"]) {
          if (refData[key] && properties[key] !== refData[key]) {
            return res.status(400).json({ code: 400, message: `${key} di poligon tidak sesuai dengan input` });
          }
        }

        // pengecekan NO_URUT yang duplikasi dengan KD_KEC dan KD_KEL sama
        const { KD_KEL, KD_BLOK, NO_URUT } = properties;

        // Lewati pengecekan jika NO_URUT bernilai null
        if (NO_URUT !== null) {
          const uniqueKey = `${KD_KEL}-${KD_BLOK}-${NO_URUT}`;

          if (uniqueSet.has(uniqueKey)) {
            return res.status(400).json({
              code: 400,
              message: `Duplikasi data ditemukan: KD_KEL ${KD_KEL}, KD_BLOK ${KD_BLOK}, NO_URUT ${NO_URUT}.`,
            });
          }

          uniqueSet.add(uniqueKey);
        }

        let convertedCoordinates;
        switch (geometry.type) {
          case "Point":
            convertedCoordinates = proj4(utm50s, wgs84, geometry.coordinates);
            break;
          case "Polygon":
            convertedCoordinates = geometry.coordinates.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point)));
            break;
          case "MultiPolygon":
            convertedCoordinates = geometry.coordinates.map((polygon: any) => polygon.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point))));
            break;
          default:
            console.warn(`Geometry type ${geometry.type} is not supported`);
            continue;
        }

        if (!convertedCoordinates || convertedCoordinates.length === 0) {
          console.warn(`Geometri tidak valid untuk ${properties?.NM_KEL}`);
          continue;
        }

        const geoJsonData = {
          type: geometry.type === "Polygon" ? "MultiPolygon" : geometry.type,
          coordinates:
            geometry.type === "Polygon"
              ? [convertedCoordinates] // Bungkus Polygon dalam array agar menjadi MultiPolygon
              : convertedCoordinates,
        };

        geojsonFeatures.push({ properties, geometry: geoJsonData });
        batchInsertData.push({ ...properties, FOTO_PERSIL: null });
        batchUpdateData.push({ geoJsonData: JSON.stringify(geoJsonData) });
      }
    } while (!result.done);

    if (geojsonFeatures.length === 0) {
      return res.status(400).json({ code: 400, message: "Tidak ada data valid yang bisa disimpan" });
    }

    const existingData = await persilRepo.find({
      where: { KD_KEC: kecamatanNew, KD_KEL: kelurahanNew },
    });

    if (existingData.length > 0) {
      await persilRepo.delete({ KD_KEC: kecamatanNew, KD_KEL: kelurahanNew });
    }

    const batchSize = 1000;
    const insertedIds: number[] = [];

    for (let i = 0; i < batchInsertData.length; i += batchSize) {
      const batch = batchInsertData.slice(i, i + batchSize);
      const insertResult = await persilRepo.createQueryBuilder().insert().into(BatasPersil).values(batch).returning("id").execute();
      insertResult.identifiers.forEach((identifier) => insertedIds.push(identifier.id));
    }

    batchUpdateData.forEach((update, index) => {
      update.id = insertedIds[index];
    });

    for (let i = 0; i < batchUpdateData.length; i += batchSize) {
      const batch = batchUpdateData.slice(i, i + batchSize);
      let updateQuery = `UPDATE batas_persil SET geom = CASE `;
      const parameters: any[] = [];
      const conditions: string[] = [];

      batch.forEach((update, index) => {
        updateQuery += `WHEN "id" = $${index * 2 + 1} THEN ST_Multi(ST_GeomFromGeoJSON($${index * 2 + 2})) `;
        parameters.push(update.id, update.geoJsonData);
        conditions.push(`"id" = $${index * 2 + 1}`);
      });

      updateQuery += `END WHERE ${conditions.join(" OR ")}`;
      await persilRepo.manager.query(updateQuery, parameters);
    }

    return res.status(200).json({
      code: 200,
      message: "File SHP berhasil dikonversi dan disimpan ke database",
    });
  } catch (error) {
    console.error("Error membaca file SHP:", error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

export const PostShpZNT = async (req: Request, res: Response) => {
  try {
    const { kecamatan, kelurahan, jenis } = req.body;
    const filePath = path.join(__dirname, "../../public/ZNT", `${kecamatan}_${kelurahan || "XX"}_${jenis}.shp`);

    const source = await open(filePath);
    const kecamatanNew = kecamatan.split(" - ")[0];
    const kelurahanNew = kelurahan.split(" - ")[0];

    const zntRepo = AppDataSource.getRepository(BatasZNT);

    // pastikan KD_PROV dan KD_KAB sesuai dengan project yang dijalankan
    const refData: Record<string, string> = {
      KD_PROV: "62",
      KD_KAB: "13",
      KD_KEC: kecamatanNew,
      KD_KEL: kelurahanNew,
    };

    const geojsonFeatures: any[] = [];

    let result;
    do {
      result = await source.read();
      if (!result.done) {
        const { properties, geometry } = result.value;
        if (!geometry) continue;

        if (!properties) {
          return res.status(400).json({ code: 400, message: "Data properties tidak ditemukan dalam file SHP" });
        }

        const requiredFields = [
          { key: "KD_PROV", label: "Kode Provinsi" },
          { key: "KD_KAB", label: "Kode Kabupaten" },
          { key: "KD_KEC", label: "Kode Kecamatan" },
          { key: "KD_KEL", label: "Kode Kelurahan" },
          { key: "KD_ZNT", label: "Kode ZNT" },
          { key: "TAHUN", label: "Tahun" },
          { key: "NIR_EKS", label: "NIR Eksisting" },
          { key: "NIR_ANAL", label: "NIR Analisis" },
          { key: "KLS_EKS", label: "Kelas Eksisting" },
          { key: "KLS_ANAL", label: "Kelas Analisis" },
          { key: "LABEL_EKS", label: "Label Eksisting" },
          { key: "LABEL_ANAL", label: "Label Analisis" },
        ];

        for (const { key, label } of requiredFields) {
          if (!properties[key]) {
            return res.status(400).json({ code: 400, message: `${label} tidak boleh kosong` });
          }

          if (refData[key] && properties[key] !== refData[key]) {
            return res.status(400).json({ code: 400, message: `${label} di poligon tidak sesuai` });
          }
        }

        let convertedCoordinates;
        switch (geometry.type) {
          case "Point":
            convertedCoordinates = proj4(utm50s, wgs84, geometry.coordinates);
            break;
          case "Polygon":
            convertedCoordinates = geometry.coordinates.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point)));
            break;
          case "MultiPolygon":
            convertedCoordinates = geometry.coordinates.map((polygon: any) => polygon.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point))));
            break;
          default:
            console.warn(`Geometry type ${geometry.type} is not supported`);
            continue;
        }

        if (!convertedCoordinates || convertedCoordinates.length === 0) {
          console.warn(`Geometri tidak valid untuk ${properties?.KD_ZNT}`);
          continue;
        }

        const geoJsonData = {
          type: geometry.type === "Polygon" ? "MultiPolygon" : geometry.type,
          coordinates:
            geometry.type === "Polygon"
              ? [convertedCoordinates] // Bungkus Polygon dalam array agar menjadi MultiPolygon
              : convertedCoordinates,
        };

        geojsonFeatures.push({
          type: "Feature",
          properties: {
            KD_PROV: properties?.KD_PROV,
            KD_KAB: properties?.KD_KAB,
            KD_KEC: properties?.KD_KEC,
            KD_KEL: properties?.KD_KEL,
            KD_ZNT: properties?.KD_ZNT,
            TAHUN: properties?.TAHUN,
            NIR_EKS: properties?.NIR_EKS,
            NIR_ANAL: properties?.NIR_ANAL,
            KLS_EKS: properties?.KLS_EKS,
            KLS_ANAL: properties?.KLS_ANAL,
            LABEL_EKS: properties?.LABEL_EKS,
            LABEL_ANAL: properties?.LABEL_ANAL,
          },
          geometry: geoJsonData,
        });
      }
    } while (!result.done);

    // Jika tidak ada data valid, hentikan proses
    if (geojsonFeatures.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Tidak ada data valid yang bisa disimpan",
      });
    }

    // Setelah validasi selesai, hapus data lama
    const existingData = await zntRepo.find({
      where: { KD_KEC: kecamatanNew, KD_KEL: kelurahanNew },
    });

    if (existingData.length > 0) {
      console.log(`Deleting existing records for Kecamatan: ${kecamatanNew} and Kelurahan: ${kelurahanNew}`);
      await zntRepo.delete({ KD_KEC: kecamatanNew, KD_KEL: kelurahanNew });
    }

    // Simpan data yang sudah valid ke dalam database
    for (const feature of geojsonFeatures) {
      const { properties, geometry } = feature;

      await zntRepo
        .createQueryBuilder()
        .insert()
        .into(BatasZNT)
        .values({
          KD_PROV: properties.KD_PROV,
          KD_KAB: properties.KD_KAB,
          KD_KEC: properties.KD_KEC,
          KD_KEL: properties.KD_KEL,
          KD_ZNT: properties.KD_ZNT,
          TAHUN: properties.TAHUN,
          NIR_EKS: properties.NIR_EKS,
          NIR_ANAL: properties.NIR_ANAL,
          KLS_EKS: properties.KLS_EKS,
          KLS_ANAL: properties.KLS_ANAL,
          LABEL_EKS: properties.LABEL_EKS,
          LABEL_ANAL: properties.LABEL_ANAL,
        })
        .execute();

      await zntRepo
        .createQueryBuilder()
        .update(BatasZNT)
        .set({
          geom: () => `ST_Multi(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}'))`,
        })
        .where("KD_ZNT = :KD_ZNT", { KD_ZNT: properties.KD_ZNT })
        .execute();
    }

    return res.status(200).json({
      code: 200,
      message: "File SHP berhasil dikonversi dan disimpan ke database",
    });
  } catch (error) {
    console.error("Error membaca file SHP:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const PostShpBlok = async (req: Request, res: Response) => {
  try {
    const { kecamatan, kelurahan, jenis } = req.body;
    const filePath = path.join(__dirname, "../../public/blok", `${kecamatan}_${kelurahan || "XX"}_${jenis}.shp`);

    const source = await open(filePath);
    const kecamatanNew = kecamatan.split(" - ")[0];
    const kelurahanNew = kelurahan.split(" - ")[0];

    const blokRepo = AppDataSource.getRepository(BatasBlok);

    // pastikan KD_PROV dan KD_KAB sesuai dengan project yang dijalankan
    const refData: Record<string, string> = {
      KD_PROV: "62",
      KD_KAB: "13",
      KD_KEC: kecamatanNew,
      KD_KEL: kelurahanNew,
    };

    const geojsonFeatures: any[] = [];

    let result;
    do {
      result = await source.read();
      if (!result.done) {
        const { properties, geometry } = result.value;
        if (!geometry) continue;

        if (!properties) {
          return res.status(400).json({ code: 400, message: "Data properties tidak ditemukan dalam file SHP" });
        }

        const requiredFields = [
          { key: "KD_PROV", label: "Kode Provinsi" },
          { key: "KD_KAB", label: "Kode Kabupaten" },
          { key: "KD_KEC", label: "Kode Kecamatan" },
          { key: "KD_KEL", label: "Kode Kelurahan" },
          { key: "KD_BLOK", label: "Kode Blok" },
        ];

        for (const { key, label } of requiredFields) {
          if (!properties[key]) {
            return res.status(400).json({ code: 400, message: `${label} tidak boleh kosong` });
          }

          if (refData[key] && properties[key] !== refData[key]) {
            return res.status(400).json({ code: 400, message: `${label} di poligon tidak sesuai` });
          }
        }

        let convertedCoordinates;
        switch (geometry.type) {
          case "Point":
            convertedCoordinates = proj4(utm50s, wgs84, geometry.coordinates);
            break;
          case "Polygon":
            convertedCoordinates = geometry.coordinates.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point)));
            break;
          case "MultiPolygon":
            convertedCoordinates = geometry.coordinates.map((polygon: any) => polygon.map((ring: any) => ring.map((point: any) => proj4(utm50s, wgs84, point))));
            break;
          default:
            console.warn(`Geometry type ${geometry.type} is not supported`);
            continue;
        }

        if (!convertedCoordinates || convertedCoordinates.length === 0) {
          console.warn(`Geometri tidak valid untuk kelurahan ${properties?.KD_KEL} & blok ${properties?.KD_BLOK}`);
          continue;
        }

        const geoJsonData = {
          type: geometry.type,
          coordinates: convertedCoordinates,
        };

        geojsonFeatures.push({
          type: "Feature",
          properties: {
            KD_PROV: properties?.KD_PROV,
            KD_KAB: properties?.KD_KAB,
            KD_KEC: properties?.KD_KEC,
            KD_KEL: properties?.KD_KEL,
            KD_BLOK: properties?.KD_BLOK,
          },
          geometry: geoJsonData,
        });
      }
    } while (!result.done);

    // Jika tidak ada data valid, hentikan proses
    if (geojsonFeatures.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Tidak ada data valid yang bisa disimpan",
      });
    }

    // Setelah validasi selesai, hapus data lama
    const existingData = await blokRepo.find({
      where: { KD_KEC: kecamatanNew, KD_KEL: kelurahanNew },
    });

    if (existingData.length > 0) {
      console.log(`Deleting existing records for Kecamatan: ${kecamatanNew} and Kelurahan: ${kelurahanNew}`);
      await blokRepo.delete({ KD_KEC: kecamatanNew, KD_KEL: kelurahanNew });
    }

    // Simpan data yang sudah valid ke dalam database
    for (const feature of geojsonFeatures) {
      const { properties, geometry } = feature;

      await blokRepo
        .createQueryBuilder()
        .insert()
        .into(BatasBlok)
        .values({
          KD_PROV: properties.KD_PROV,
          KD_KAB: properties.KD_KAB,
          KD_KEC: properties.KD_KEC,
          KD_KEL: properties.KD_KEL,
          KD_BLOK: properties.KD_BLOK,
        })
        .execute();

      await blokRepo
        .createQueryBuilder()
        .update(BatasBlok)
        .set({
          geom: () => `ST_GeomFromGeoJSON('${JSON.stringify(geometry)}')`,
        })
        .where("KD_BLOK = :KD_BLOK", { KD_BLOK: properties.KD_BLOK })
        .execute();
    }

    return res.status(200).json({
      code: 200,
      message: "File SHP berhasil dikonversi dan disimpan ke database",
    });
  } catch (error) {
    console.error("Error membaca file SHP:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
