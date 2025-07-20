/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MapContainer, TileLayer, GeoJSON as LeafletGeoJSON, ZoomControl, Pane, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LandDrawer from "./ModalDetailNOP";
import IconLayerControl from "./IconLayerControl";
import AxiosError from "axios";
import toast from "react-hot-toast";
import L from "leaflet";
import { getPolygonCenter } from "@/utility/GetPolygonCenter";
import MarkerClusterGroup from "react-leaflet-markercluster";

import { ApiResponse, GeomData, WarnaKelData } from "@/utility/Interfaces";
import { defaultGeoJsonStyle, defaultGeoJsonStyleBlok, defaultGeoJsonStyleKelurahan } from "@/utility/GeoJSONStyles";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

const Maps = ({
  onChangeTematik,
  selectedTematik,
  isZNT,
  setIsZNT,
  searchedPolygon,
  latitudeCP,
  longitudeCP,
  loading,
  setLoading,
}: {
  onChangeTematik: any;
  selectedTematik: string;
  isZNT: boolean;
  setIsZNT: (value: boolean) => void;
  searchedPolygon: any;
  searchedNOP: any;
  latitudeCP: any;
  longitudeCP: any;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [geoJsonDataKelurahan, setGeoJsonDataKelurahan] = useState<GeoJSON.FeatureCollection | null>(null);
  const [geoJsonDataBlok, setGeoJsonDataBlok] = useState<GeoJSON.FeatureCollection | null>(null);
  const [geoJsonDataPersil, setGeoJsonDataPersil] = useState<GeoJSON.FeatureCollection | null>(null);
  const [geoJsonDataZNT, setGeoJsonDataZNT] = useState<GeoJSON.FeatureCollection | null>(null);
  const [searchNop, setSearchNop] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geoJsonStyles, setGeoJsonStyles] = useState<Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> | null>(null);
  const [geoJsonStylesPersil, setGeoJsonStylesPersil] = useState<Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }>>({ defaultGeoJsonStyleKelurahan });
  const [geoJsonStylesKelurahan, setGeoJsonStylesKelurahan] = useState<Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }>>({ defaultGeoJsonStyleKelurahan });
  const [selectedLayerBasemap, setSelectedLayerBasemap] = useState<string[]>(["Google Map"]);
  const [selectedLayerBatas, setSelectedLayerBatas] = useState<string[]>(["Batas Kelurahan"]);
  const [selectedLayerTtik, setSelectedLayerTitik] = useState<string[]>([""]);
  const [geomData, setGeomData] = useState<GeomData>({
    type: "",
    coordinates: [],
  });
  const [fotoPersil, setFotoPersil] = useState<string[] | null>(null);
  const [dataTitik, setDataTitik] = useState<any>([]);

  // const [geoKelurahan, setGeoKelurahan] = useState<any>([]);
  // const [geoBlok, setGeoBlok] = useState<any>([]);
  // const [clusteredData, setClusteredData] = useState<any>({});

  useEffect(() => {
    // Fetch data kelurahan dari API
    const fetchDataKel = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<GeoJSON.Feature>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataskelurahan`);
        setGeoJsonDataKelurahan({
          type: "FeatureCollection",
          features: response.data.data,
        }); // Simpan data GeoJSON ke state
      } catch (error) {
        if (error instanceof AxiosError && (await error).status === 404) {
          toast.error("Data batas kelurahan tidak ditemukan.");
          return { code: 404, data: [], message: "Data batas kelurahan tidak tersedia" };
        }
        console.error("Error fetching data:", error);
        return { code: 500, data: [], message: "Terjadi kesalahan" };
      } finally {
        setLoading(false);
      }
    };

    fetchDataKel();
  }, [setLoading]);

  useEffect(() => {
    // Fetch data blok dari API
    const fetchDataBlok = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<GeoJSON.Feature>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/batasblok`);
        setGeoJsonDataBlok({
          type: "FeatureCollection",
          features: response.data.data,
        }); // Simpan data GeoJSON ke state
      } catch (error) {
        if (error instanceof AxiosError && (await error).status === 404) {
          toast.error("Data batas blok tidak ditemukan.");
          return { code: 404, data: [], message: "Data batas blok tidak tersedia" };
        }
        console.error("Error fetching data:", error);
        return { code: 500, data: [], message: "Terjadi kesalahan" };
      } finally {
        setLoading(false);
      }
    };

    fetchDataBlok();
  }, [setLoading]);

  useEffect(() => {
    // Fetch data persil dari API
    const fetchDataPersil = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<GeoJSON.Feature>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataspersil`);
        setGeoJsonDataPersil({
          type: "FeatureCollection",
          features: response.data.data,
        }); // Simpan data GeoJSON ke state
      } catch (error) {
        if (error instanceof AxiosError && (await error).status === 404) {
          toast.error("Data batas persil tidak ditemukan.");
          return { code: 404, data: [], message: "Data batas persil tidak tersedia" };
        }
        console.error("Error fetching data:", error);
        return { code: 500, data: [], message: "Terjadi kesalahan" };
      } finally {
        setLoading(false);
      }
    };

    fetchDataPersil();
  }, [setLoading]);

  useEffect(() => {
    // Fetch data ZNT dari API
    const fetchDataZNT = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<GeoJSON.Feature>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/batasznt`);
        setGeoJsonDataZNT({
          type: "FeatureCollection",
          features: response.data.data,
        }); // Simpan data GeoJSON ke state
      } catch (error) {
        if (error instanceof AxiosError && (await error).status === 404) {
          toast.error("Data batas ZNT tidak ditemukan.");
          return { code: 404, data: [], message: "Data batas ZNT tidak tersedia" };
        }
        console.error("Error fetching data:", error);
        return { code: 500, data: [], message: "Terjadi kesalahan" };
      } finally {
        setLoading(false);
      }
    };

    fetchDataZNT();
  }, [setLoading]);

  // if onChangeTematik berubah dari parent state
  useEffect(() => {
    setGeoJsonStyles(() => {
      return null; // Hapus existing state
    });

    setTimeout(() => {
      setGeoJsonStyles(onChangeTematik); // Set state dengan value baru
    }, 0);
  }, [onChangeTematik]);

  useEffect(() => {
    const fetchWarnaKel = async () => {
      try {
        setLoading(true);
        const warnaKelResponse = await axios.get<ApiResponse<WarnaKelData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/refwarnakelurahan`);
        const warnaMap: Record<string, string> = {}; // Map ID to WARNA
        const newStylesPersil: Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> = {};
        const newStylesKel: Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> = {};

        warnaKelResponse.data.data.forEach((item: WarnaKelData) => {
          warnaMap[`${item.KD_PROV}${item.KD_KAB}${item.KD_KEC}${item.KD_KEL}`] = item.WARNA;
        });

        if (geoJsonDataKelurahan) {
          geoJsonDataKelurahan.features.forEach((feature) => {
            if (!feature.properties) return; // Ensure properties exist

            const KelNum = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}`;
            const fillColor = warnaMap[KelNum] || "#FFFFFF"; // Default color if not found

            newStylesPersil[KelNum] = {
              color: "#000000",
              weight: 0.5,
              opacity: 1,
              fillColor: fillColor,
              fillOpacity: 0.35,
            };

            newStylesKel[KelNum] = {
              color: "#000000",
              weight: 2,
              opacity: 1,
              fillColor: fillColor,
              fillOpacity: 0.35,
            };
          });
        }

        setGeoJsonStylesPersil(newStylesPersil);
        setGeoJsonStylesKelurahan(newStylesKel);
      } catch (error) {
        if (error instanceof AxiosError && (await error).status === 404) {
          toast.error("Data warna kelurahan tidak ditemukan.");
          return { code: 404, data: [], message: "Data warna kelurahan tidak tersedia" };
        }
        console.error("Error fetching data:", error);
        return { code: 500, data: [], message: "Terjadi kesalahan" };
      } finally {
        setLoading(false);
      }
    };

    fetchWarnaKel();
  }, [geoJsonDataKelurahan, setLoading]);

  const onEachFeatureKel = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.NM_KEL) {
      layer.bindPopup(`<b>Nama Kelurahan:</b> ${feature.properties.NM_KEL}`);
    }
  };

  const onEachFeatureBlok = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.KD_BLOK) {
      layer.bindPopup(`<b>Kode Blok:</b> ${feature.properties.KD_BLOK}`);
    }
  };

  const onEachFeaturePersil = (feature: any, layer: any) => {
    if (feature.properties) {
      layer.bindPopup(`${feature.properties.KD_PROV}.${feature.properties.KD_KAB}.${feature.properties.KD_KEC}.${feature.properties.KD_KEL}.${feature.properties.KD_BLOK}.${feature.properties.NO_URUT}.${feature.properties.KD_JNS_OP}`);
    }

    const NOP = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}${feature.properties.KD_BLOK}${feature.properties.NO_URUT}${feature.properties.KD_JNS_OP}`;

    layer.on("click", async () => {
      if (feature.properties.NO_URUT === null) {
        setSearchNop("data tidak ditemukan");
      }
      try {
        setLoading(true);
        const fotoResponse = await axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/fotopersil/${NOP}`);
        setFotoPersil(fotoResponse.data.imageUrls);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "NOP tidak Valid");
      } finally {
        setLoading(false);
        setGeomData(feature.geometry);
        setSearchNop(NOP);
        setDrawerOpen(true);
      }
    });
  };

  const onEachFeatureZNT = (feature: any, layer: any) => {
    if (!feature.properties) return; // Ensure properties exist

    const ZNTnum = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}${feature.properties.KD_ZNT}`;

    if (onChangeTematik[ZNTnum]) {
      layer.bindTooltip(feature.properties.KD_ZNT, {
        permanent: true,
        direction: "center",
        className: "transparent-tooltip",
      });
    }
  };

  const onEachFeatureSebaranZNT = (feature: any, layer: any) => {
    if (!feature.properties) return; // Ensure properties exist

    const NOP = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}${feature.properties.KD_BLOK}${feature.properties.NO_URUT}${feature.properties.KD_JNS_OP}`;

    if (onChangeTematik[NOP]) {
      layer.on("click", () => {
        if (feature.properties.NO_URUT === null) {
          setSearchNop("data tidak ditemukan");
        }

        setFotoPersil(feature.properties.FOTO_PERSIL);
        setGeomData(feature.geometry);
        setSearchNop(NOP);
        setDrawerOpen(true);
      });
    }
  };

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (searchedPolygon && mapRef.current) {
      const coords = searchedPolygon.coordinates.flat(2); // Assuming it's a Polygon
      const centroid = getPolygonCenter(coords);
      mapRef.current.setView(centroid, 20, { animate: true });
    }
  }, [searchedPolygon]);

  const searchRef = useRef<L.GeoJSON | null>(null); // Store previous polygon

  useEffect(() => {
    if (mapRef.current) {
      // Remove previous polygon before adding a new one
      if (searchRef.current) {
        mapRef.current.removeLayer(searchRef.current);
      }

      if (searchedPolygon) {
        const newLayer = L.geoJSON(searchedPolygon, {
          style: {
            color: "yellow",
            weight: 3,
            fillOpacity: 0.5,
          },
        });

        newLayer.addTo(mapRef.current); // Add the new polygon to the map
        mapRef.current.fitBounds(newLayer.getBounds(), { padding: [50, 50] }); // Zoom to new polygon

        searchRef.current = newLayer; // Store reference to the new polygon
      }
    }
  }, [searchedPolygon]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [titikRes, kelRes, blokRes] = await Promise.all([
  //         //
  //         axios.get<any>("http://localhost:8100/api/get/gettitikpendataan"),
  //         axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataskelurahan`),
  //         axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/batasblok`),
  //       ]);
  //       setDataTitik(titikRes.data.data); // hasil array of titik pendataan
  //       setGeoKelurahan(kelRes.data.data); // GeoJSON Feature[]
  //       setGeoBlok(blokRes.data.data); // GeoJSON Feature[]
  //     } catch (err) {
  //       console.error("Gagal mengambil data:", err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   if (!dataTitik.length || !geoKelurahan.length || !geoBlok.length) return;

  //   const result = {};

  //   geoKelurahan.forEach((kel: any) => {
  //     const kdKel = kel.properties.KD_KEL;
  //     const kelKey = `${kel.properties.KD_PROV}${kel.properties.KD_KAB}${kel.properties.KD_KEC}${kdKel}`;
  //     const kelPolygon = turf.polygon(kel.geometry.coordinates);

  //     const titikDalamKel = dataTitik.filter((item: any) => {
  //       const { geom } = item.datOpPajak;
  //       const point = turf.point(geom.coordinates);
  //       return turf.booleanPointInPolygon(point, kelPolygon);
  //     });

  //     const blokInKel = geoBlok.filter((blok: any) => blok.properties.KD_KEL === kel.properties.KD_KEL && blok.properties.KD_KEC === kel.properties.KD_KEC);

  //     const blokResult = {};
  //     blokInKel.forEach((blok: any) => {
  //       const kdBlok = blok.properties.KD_BLOK;
  //       const blokKey = `${blok.properties.KD_PROV}${blok.properties.KD_KAB}${blok.properties.KD_KEC}${blok.properties.KD_KEL}${kdBlok}`;
  //       const blokPolygon = turf.polygon(blok.geometry.coordinates);

  //       const titikDalamBlok = titikDalamKel.filter((item: any) => {
  //         const { geom } = item.datOpPajak;
  //         const point = turf.point(geom.coordinates);
  //         return turf.booleanPointInPolygon(point, blokPolygon);
  //       });

  //       blokResult[blokKey] = {
  //         geojson_blok: blok,
  //         titik: titikDalamBlok,
  //       };
  //     });

  //     result[kelKey] = {
  //       nama_kel: kel.properties.NM_KEL,
  //       geojson_kel: kel,
  //       blok: blokResult,
  //     };
  //   });

  //   setClusteredData(result);
  // }, [dataTitik, geoKelurahan, geoBlok]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<any>(`${process.env.NEXT_PUBLIC_PENDATAAN_API_URL}/api/get/gettitikpendataan`); // sesuaikan endpoint
        setDataTitik(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil data titik pendataan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  if (latitudeCP === 0 || longitudeCP === 0) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <style jsx global>{`
        .transparent-tooltip {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          color: white !important;
          font-size: 10px !important;
          font-weight: bold !important;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7) !important;
          width: 50px; /* Set fixed width */
          height: 20px; /* Set fixed height */
          text-align: center;
          white-space: nowrap; /* Prevent text wrapping */
          overflow: hidden; /* Hide overflow text */
        }
      `}</style>
      <div style={{ position: "relative" }}>
        <LandDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} searchNop={searchNop} geomData={geomData} fotoPersil={fotoPersil} />

        {/* dropdown basemap icon */}
        <IconLayerControl selectedLayer={selectedLayerBasemap} setSelectedLayer={setSelectedLayerBasemap} layerType={"Basemap"} />

        {/* dropdown titik pendataan icon */}
        <IconLayerControl selectedLayer={selectedLayerTtik} setSelectedLayer={setSelectedLayerTitik} layerType={"Titik"} />

        {/* dropdown batas icon */}
        <IconLayerControl
          selectedLayer={selectedLayerBatas}
          setSelectedLayer={setSelectedLayerBatas}
          layerType={"Batas"}
          toggleZNT={() => {
            setIsZNT(false);
            setGeoJsonStyles(() => {
              return null;
            });
          }}
        />

        <MapContainer
          style={{
            height: "100vh",
          }}
          center={[latitudeCP, longitudeCP]}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          ref={mapRef}
        >
          {/* Atur zIndex batas */}
          <Pane name="popup" style={{ zIndex: 800 }} />
          <Pane name="titik-pendataan" style={{ zIndex: 700 }} />
          <Pane name="batas-persil" style={{ zIndex: 600 }} />
          <Pane name="batas-blok" style={{ zIndex: 500 }} />
          <Pane name="batas-kelurahan" style={{ zIndex: 400 }} />

          {/* Layer Peta */}
          {selectedLayerBasemap.includes("Google Map") && <TileLayer attribution="Google Maps" url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />}
          {selectedLayerBasemap.includes("Google Satellite") && (
            <>
              <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
              <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
            </>
          )}
          {selectedLayerBasemap.includes("Open Street Map") && <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />}

          {!isZNT && selectedLayerBatas.includes("Batas Kelurahan") && geoJsonDataKelurahan && (
            <LeafletGeoJSON
              data={geoJsonDataKelurahan}
              onEachFeature={onEachFeatureKel}
              style={(feature) => {
                if (!feature || !feature.properties) return defaultGeoJsonStyle;

                if (selectedLayerBatas.includes("Batas Persil")) return defaultGeoJsonStyleKelurahan;

                const KelNum = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}`;

                return geoJsonStylesKelurahan[KelNum] || defaultGeoJsonStyleKelurahan;
              }}
              pane="batas-kelurahan"
            />
          )}
          {!isZNT && selectedLayerBatas.includes("Batas Blok") && geoJsonDataBlok && <LeafletGeoJSON data={geoJsonDataBlok} onEachFeature={onEachFeatureBlok} style={defaultGeoJsonStyleBlok} pane="batas-blok" />}

          {/* Layer GeoJSON (Contoh Batas Persil) */}
          {!isZNT && selectedLayerBatas.includes("Batas Persil") && geoJsonDataPersil && (
            <LeafletGeoJSON
              data={geoJsonDataPersil}
              onEachFeature={onEachFeaturePersil}
              style={(feature) => {
                if (!feature || !feature.properties) return defaultGeoJsonStyle;

                const NOP = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}${feature.properties.KD_BLOK}${feature.properties.NO_URUT}${feature.properties.KD_JNS_OP}`;
                const KelNum = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}`;

                return geoJsonStyles ? geoJsonStyles[NOP] : geoJsonStylesPersil[KelNum];
              }}
              pane="batas-persil"
            />
          )}

          {isZNT && selectedTematik === "Peta ZNT" && geoJsonDataZNT && (
            <LeafletGeoJSON
              data={geoJsonDataZNT}
              onEachFeature={onEachFeatureZNT}
              style={(feature) => {
                if (!feature || !feature.properties) return defaultGeoJsonStyle;

                const ZNTnum = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}${feature.properties.KD_ZNT}`;

                return geoJsonStyles ? geoJsonStyles[ZNTnum] : defaultGeoJsonStyle;
              }}
            />
          )}

          {isZNT && selectedTematik === "Sebaran ZNT" && geoJsonDataPersil && (
            <LeafletGeoJSON
              data={geoJsonDataPersil}
              onEachFeature={onEachFeatureSebaranZNT}
              style={(feature) => {
                if (!feature || !feature.properties) return defaultGeoJsonStyle;

                const NOP = `${feature.properties.KD_PROV}${feature.properties.KD_KAB}${feature.properties.KD_KEC}${feature.properties.KD_KEL}${feature.properties.KD_BLOK}${feature.properties.NO_URUT}${feature.properties.KD_JNS_OP}`;

                return geoJsonStyles ? geoJsonStyles[NOP] : defaultGeoJsonStyle;
              }}
            />
          )}

          {/* {Object.entries(clusteredData).map(([kelKey, kelValue]) =>
            Object.entries(kelValue.blok).map(([blokKey, blokValue]) =>
              blokValue.titik.map((item: any, index: number) => {
                const { datOpPajak, wajibPajak, datOpBangunan } = item;
                const [lng, lat] = datOpPajak.geom.coordinates;

                return (
                  <CircleMarker
                    key={`${blokKey}-${index}`}
                    center={[lat, lng]}
                    radius={6}
                    pathOptions={{
                      color: datOpPajak.kd_jns_pelayanan === "11" ? "#000" : datOpPajak.kd_jns_pelayanan === "12" ? "#000" : datOpPajak.kd_jns_pelayanan === "13" ? "#000" : "gray",
                      fillColor: datOpPajak.kd_jns_pelayanan === "11" ? "#1af513" : datOpPajak.kd_jns_pelayanan === "12" ? "#f2f513" : datOpPajak.kd_jns_pelayanan === "13" ? "#ff2525" : "gray",
                      fillOpacity: 0.7,
                    }}
                  >
                    <Popup>
                      <strong>NOP:</strong> {datOpPajak.nop_join}
                      <br />
                      <strong>Nama WP:</strong> {wajibPajak?.nm_wp || "-"}
                      <br />
                      <strong>Jalan:</strong> {datOpPajak.jalan_op}
                      <br />
                      <strong>Luas Bumi:</strong> {datOpPajak.total_luas_bumi} m²
                      <br />
                      <strong>Luas Bangunan:</strong> {datOpPajak.total_luas_bng} m²
                      <br />
                      <strong>Jumlah Bangunan:</strong> {datOpBangunan.length}
                      <br />
                      <strong>Kode Pelayanan:</strong> {datOpPajak.kd_jns_pelayanan}
                    </Popup>
                  </CircleMarker>
                );
              })
            )
          )} */}

          {selectedLayerTtik.includes("Titik Pendataan") && (
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={(cluster: any) => {
                const count = cluster.getChildCount();

                return L.divIcon({
                  html: `
        <div class="triangle-cluster">
          <span class="cluster-count">${count}</span>
        </div>
      `,
                  className: "triangle-cluster-wrapper", // agar styling default Leaflet tidak mengganggu
                  iconSize: L.point(40, 40, true),
                });
              }}
            >
              {dataTitik.map((item: any, index: number) => (
                <CircleMarker
                  key={index}
                  center={[item.datOpPajak.geom.coordinates[1], item.datOpPajak.geom.coordinates[0]]}
                  radius={8}
                  pathOptions={{
                    color: item.datOpPajak.kd_jns_pelayanan === "11" ? "#000" : item.datOpPajak.kd_jns_pelayanan === "12" ? "#000" : item.datOpPajak.kd_jns_pelayanan === "13" ? "#000" : "gray",
                    fillColor: item.datOpPajak.kd_jns_pelayanan === "11" ? "#1af513" : item.datOpPajak.kd_jns_pelayanan === "12" ? "#f2f513" : item.datOpPajak.kd_jns_pelayanan === "13" ? "#ff2525" : "gray",
                    fillOpacity: 0.8,
                  }}
                  pane="titik-pendataan"
                >
                  {/* <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  <span>{item.datOpPajak.nop}</span>
                </Tooltip> */}
                  <Popup pane="popup">
                    {item.datOpPajak.foto_op && item.datOpPajak.foto_op.length !== 0 ? (
                      <Box sx={{ width: "100%", maxHeight: 250, position: "relative", borderRadius: 2, overflow: "hidden" }}>
                        <Swiper pagination={{ clickable: true }} navigation={true} modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1}>
                          {item.datOpPajak.foto_op.map((url: any, index: number) => (
                            <SwiperSlide key={index}>
                              <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                                <Image
                                  src={url}
                                  alt={`Foto Persil ${index + 1}`}
                                  width={720}
                                  height={400}
                                  quality={70}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </Box>
                    ) : (
                      <Box sx={{ justifyItems: "center" }}>
                        <Image src="/placeholder.png" alt="No Image Available" width={0} height={0} sizes="100vw" style={{ objectFit: "cover", borderRadius: "10px", width: "80%" }} />
                      </Box>
                    )}
                    <br />
                    <strong>NOP:</strong> {item.datOpPajak.nop_join}
                    <br />
                    <strong>Nama WP:</strong> {item.wajibPajak?.nm_wp || "-"}
                    <br />
                    <strong>Jalan:</strong> {item.datOpPajak.jalan_op}
                    <br />
                    <strong>Luas Bumi:</strong> {item.datOpPajak.total_luas_bumi} m²
                    <br />
                    <strong>Luas Bangunan:</strong> {item.datOpPajak.total_luas_bng} m²
                    <br />
                    <strong>Jumlah Bangunan:</strong> {item.datOpBangunan.length}
                    <br />
                    <strong>Kode Pelayanan:</strong> {item.datOpPajak.kd_jns_pelayanan}
                  </Popup>
                </CircleMarker>
              ))}
            </MarkerClusterGroup>
          )}

          <ZoomControl position="bottomright" />
        </MapContainer>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

export default Maps;
