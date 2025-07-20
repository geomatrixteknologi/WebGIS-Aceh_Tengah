/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import DrawerList from "./DrawerList";
import LandDrawer from "./ModalDetailNOP";
import toast from "react-hot-toast";
import { GeomData } from "@/utility/Interfaces";

interface PersilData {
  geom: GeomData;
  KD_PROV: string;
  KD_KAB: string;
  KD_KEC: string;
  KD_KEL: string;
  KD_BLOK: string;
  NO_URUT: string;
  KD_JNS_OP: string;
  FOTO_PERSIL: string[];
}

interface ApiResponse<T> {
  data: T;
}

const Navbar = ({ setSearchedPolygon, setSearchedNOPZoom, drawerOpen, setDrawerOpen, onClose, latitudeCP, setLatitudeCP, longitudeCP, setLongitudeCP }: any) => {
  const [nop, setNop] = useState("");
  const [error, setError] = useState("");
  const [searchNop, setSearchNop] = useState("");
  const [geomData, setGeomData] = useState<GeomData>({
    type: "",
    coordinates: [],
  });
  const [fotoPersil, setFotoPersil] = useState<string[]>([]);

  const formatNop = (value: any) => {
    // Hapus semua karakter non-digit
    let numbersOnly = value.replace(/\D/g, "");

    // Pastikan panjang maksimal 18 digit
    numbersOnly = numbersOnly.slice(0, 18);

    // Format sesuai pola "XX.XX.XXX.XXX.XXX.XXXX.X"
    const formatted = numbersOnly
      .replace(/^(\d{2})(\d{0,2})/, "$1.$2") // 2 digit pertama + titik + 2 digit berikutnya
      .replace(/^(\d{2})\.(\d{2})(\d{0,3})/, "$1.$2.$3") // 2 digit + titik + 2 digit + titik + 3 digit
      .replace(/^(\d{2})\.(\d{2})\.(\d{3})(\d{0,3})/, "$1.$2.$3.$4") // tambah 3 digit + titik + 3 digit
      .replace(/^(\d{2})\.(\d{2})\.(\d{3})\.(\d{3})(\d{0,3})/, "$1.$2.$3.$4.$5") // tambah 3 digit + titik + 3 digit
      .replace(/^(\d{2})\.(\d{2})\.(\d{3})\.(\d{3})\.(\d{3})(\d{0,4})/, "$1.$2.$3.$4.$5.$6") // tambah 4 digit + titik + 1 digit
      .replace(/^(\d{2})\.(\d{2})\.(\d{3})\.(\d{3})\.(\d{3})\.(\d{4})(\d{0,1})/, "$1.$2.$3.$4.$5.$6.$7"); // tambah 1 digit terakhir

    return formatted;
  };

  const validateNop = (nop: string) => {
    return /^\d{2}\.\d{2}\.\d{3}\.\d{3}\.\d{3}\.\d{4}\.\d{1}$/.test(nop);
  };

  const handleNopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNop = formatNop(e.target.value);
    setNop(formattedNop);

    if (formattedNop.length === 24 && validateNop(formattedNop)) {
      setError("");
    } else if (formattedNop.length === 0) {
      setError("");
    } else {
      setError("Format NOP tidak valid (XX.XX.XXX.XXX.XXX.XXXX.X)");
    }
  };

  const handleSearch = async () => {
    if (!validateNop(nop)) {
      setError("Format NOP tidak valid.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    try {
      // panggil api get batas persil dari NOP
      const response = await axios.get<ApiResponse<PersilData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataspersilbyNOP?nop=${nop.replace(/\./g, "")}`);
      const fotoResponse = await axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/fotopersil/${nop.replace(/\./g, "")}`);

      const data = response.data.data;
      const NOP = `${data.KD_PROV}${data.KD_KAB}${data.KD_KEC}${data.KD_KEL}${data.KD_BLOK}${data.NO_URUT}${data.KD_JNS_OP}`;
      const geom = data.geom;
      const foto = fotoResponse.data.imageUrls;

      setSearchedPolygon(response.data.data.geom);
      setSearchedNOPZoom(nop);
      // ubah setFotoPersil, setGeomData, setSearchNOP, setDrawerOpen untuk memanggil LandDrawer
      setFotoPersil(foto);
      setGeomData(geom);
      setSearchNop(NOP);
      setDrawerOpen(true);
      setError("");
    } catch (error) {
      toast.error("NOP tidak ditemukan.");
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  return (
    <>
      <div className="p-4 -700  max-w-md mx-auto absolute top-4 left-4 z-[1000]">
        <div className="flex items-center space-x-2 border p-2 bg-white rounded-md">
          <DrawerList
            setSearchedPolygon={setSearchedPolygon}
            setFotoPersil={setFotoPersil}
            setGeomData={setGeomData}
            setSearchedNOPZoom={setSearchedNOPZoom}
            setSearchNop={setSearchNop}
            setDrawerOpen={setDrawerOpen}
            latitudeCP={latitudeCP}
            setLatitudeCP={setLatitudeCP}
            longitudeCP={longitudeCP}
            setLongitudeCP={setLongitudeCP}
          />
          <TextField fullWidth variant="standard" placeholder="Search NOP" value={nop} onChange={handleNopChange} error={!!error} helperText={error} />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <LandDrawer open={drawerOpen} onClose={onClose} searchNop={searchNop} geomData={geomData} fotoPersil={fotoPersil} />
      </div>
    </>
  );
};

export default Navbar;
