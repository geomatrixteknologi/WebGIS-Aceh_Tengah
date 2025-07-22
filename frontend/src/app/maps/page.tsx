/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LegendaTematik from "@/components/LegendaTematik";
import Navbar from "@/components/Navbar";
import SelectPetaTematik from "@/components/SelectPetaTematik";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { logged, WarnaData } from "@/utility/Interfaces";

export default function MapsPage() {
  const [selectedTematik, setSelectedTematik] = useState<string>("");
  const [onChangeTematik, setOnChangeTematik] = useState<Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> | null>(null); // Store selected tematik geoJsonStyle
  const [isZNT, setIsZNT] = useState<boolean>(false);
  const router = useRouter();
  const [searchedPolygon, setSearchedPolygon] = useState(null);
  const [searchedNOP, setSearchedNOPZoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [warnaData, setWarnaData] = useState<WarnaData[]>([]);
  const [kdKecZNT, setKdKecZNT] = useState<string>("");
  const [kdKelZNT, setKdKelZNT] = useState<string>("");
  const [tahunZNT, setTahunZNT] = useState<string>("");
  const [latitudeCP, setLatitudeCP] = useState<number>(0);
  const [longitudeCP, setLongitudeCP] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get<logged>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        if (!res.data.loggedIn) router.push("/login");
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/centerpoint`, { withCredentials: true }).then((res) => {
      setLatitudeCP(res.data.data.LATITUDE);
      setLongitudeCP(res.data.data.LONGITUDE);
    });
  }, []);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleResetPolygon = () => {
    setSearchedPolygon(null);
    setSearchedNOPZoom(null);
    setDrawerOpen(false);
  };
  return (
    <>
      <div>
        <Navbar
          setSearchedPolygon={setSearchedPolygon}
          setSearchedNOPZoom={setSearchedNOPZoom}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          onClose={handleResetPolygon}
          latitudeCP={latitudeCP}
          setLatitudeCP={setLatitudeCP}
          longitudeCP={longitudeCP}
          setLongitudeCP={setLongitudeCP}
        />
        <SelectPetaTematik
          selectedTematik={selectedTematik}
          setSelectedTematik={setSelectedTematik}
          setOnChangeTematik={setOnChangeTematik}
          setIsZNT={setIsZNT}
          setWarnaData={setWarnaData}
          setKdKecZNT={setKdKecZNT}
          setKdKelZNT={setKdKelZNT}
          setTahunZNT={setTahunZNT}
          setLoading={setLoading}
        />
        <LegendaTematik selectedTematik={selectedTematik} warnaData={warnaData} kdKecZNT={kdKecZNT} kdKelZNT={kdKelZNT} tahunZNT={tahunZNT} />
        <Map
          onChangeTematik={onChangeTematik}
          selectedTematik={selectedTematik}
          isZNT={isZNT}
          setIsZNT={setIsZNT}
          searchedNOP={searchedNOP}
          searchedPolygon={searchedPolygon}
          latitudeCP={latitudeCP}
          longitudeCP={longitudeCP}
          loading={loading}
          setLoading={setLoading}
        />
        <Toaster position="top-center" />
      </div>
    </>
  );
}
