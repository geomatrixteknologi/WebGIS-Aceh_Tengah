/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, List, ListItemButton, ListItemText, Popover } from "@mui/material";
import { useState } from "react";
import ModalStatusOP from "./ModalStatusOP";
import axios from "axios";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { BarChart } from "@mui/icons-material";
import toast from "react-hot-toast";
import { ApiResponse, DatOpBumiData, PersilData, SebaranZNTData, SpptData, WarnaData, ZNTData } from "@/utility/Interfaces";

const TematikType = [
  { name: "Status Pembayaran", icon: <BarChart /> },
  { name: "Status Pendaftaran", icon: <BarChart /> },
  { name: "Peta ZNT", icon: <BarChart /> },
  { name: "Sebaran ZNT", icon: <BarChart /> },
];

interface SelectPetaTematikProps {
  selectedTematik: string;
  setSelectedTematik: React.Dispatch<React.SetStateAction<string>>;
  setOnChangeTematik: React.Dispatch<React.SetStateAction<Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> | null>>;
  setIsZNT: React.Dispatch<React.SetStateAction<boolean>>;
  setWarnaData: React.Dispatch<React.SetStateAction<WarnaData[]>>;
  setKdKecZNT: React.Dispatch<React.SetStateAction<string>>;
  setKdKelZNT: React.Dispatch<React.SetStateAction<string>>;
  setTahunZNT: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
}

const SelectPetaTematik: React.FC<SelectPetaTematikProps> = ({ selectedTematik, setSelectedTematik, setOnChangeTematik, setIsZNT, setWarnaData, setKdKecZNT, setKdKelZNT, setTahunZNT, setLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleSPPTData = async (spptData: SpptData[]) => {
    const newStyles: Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> = {};

    try {
      setLoading(true);
      const warnaResponse = await axios.get<ApiResponse<WarnaData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/refwarnastatuspembayaran`);
      const warnaMap: Record<number, string> = {}; // Map id dengan WARNA

      warnaResponse.data.data.forEach((item: WarnaData) => {
        warnaMap[item.id] = item.WARNA;
      });

      // Proses spptData
      spptData.forEach((item) => {
        const NOP = `${item.kdPropinsi}${item.kdDati2}${item.kdKecamatan}${item.kdKelurahan}${item.kdBlok}${item.noUrut}${item.kdJnsOp}`;
        const fillColor = warnaMap[Number(item.statusPembayaranSppt)] || "#FFFFFF"; // Default color if not found

        newStyles[NOP] = {
          color: "#000000",
          weight: 0.5,
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 0.65,
        };
      });

      setWarnaData(warnaResponse.data.data);
      setSelectedTematik("Status Pembayaran");
      setOnChangeTematik(newStyles); // Update parent state
      setIsZNT(false);
    } catch (error) {
      console.error("Error mengambil warna untuk status pembayaran:", error);
    } finally {
      setLoading(false); // 👉 End loading
    }
  };

  const handleStatusPendaftaran = async () => {
    try {
      setLoading(true);
      const [datOpBumiResponse, batasPersilResponse, warnaResponse] = await Promise.all([
        axios.get<ApiResponse<DatOpBumiData>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/datopbumi`),
        axios.get<ApiResponse<PersilData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataspersil`),
        axios.get<ApiResponse<WarnaData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/refwarnastatuspendaftaran`),
      ]);
      const datOpBumiData = datOpBumiResponse.data.data;
      const batasPersilData = batasPersilResponse.data.data;
      const warnaMap = Object.fromEntries(warnaResponse.data.data.map((item: WarnaData) => [item.id, item.WARNA]));

      const datOpBumiNOP = new Set(datOpBumiData.map((i) => `${i.kdPropinsi}${i.kdDati2}${i.kdKecamatan}${i.kdKelurahan}${i.kdBlok}${i.noUrut}${i.kdJnsOp}`));

      const newStyles: Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> = {};

      // cocokin nop kedua data
      // mapping tiap kondisi sesuai id dan status refWarnaStatusPendaftaran
      batasPersilData.map((item) => {
        const NOPBatasPersil = `${item.properties.KD_PROV}${item.properties.KD_KAB}${item.properties.KD_KEC}${item.properties.KD_KEL}${item.properties.KD_BLOK}${item.properties.NO_URUT}${item.properties.KD_JNS_OP}`;

        if (item.properties.NO_URUT === null) {
          newStyles[NOPBatasPersil] = {
            color: "#000000",
            weight: 0.5,
            opacity: 1,
            fillColor: warnaMap[0] || "#FFFFFF",
            fillOpacity: 0.65,
          };
          return { nop: NOPBatasPersil, idStatus: 0 };
        }

        // mapping status berdasarkan NOP
        const idStatus = datOpBumiNOP.has(NOPBatasPersil) ? 1 : 2;

        newStyles[NOPBatasPersil] = {
          color: "#000000",
          weight: 0.5,
          opacity: 1,
          fillColor: warnaMap[idStatus] || "#FFFFFF",
          fillOpacity: 0.65,
        };

        return { nop: NOPBatasPersil, idStatus };
      });

      setWarnaData(warnaResponse.data.data);
      setSelectedTematik("Status Pendaftaran");
      setOnChangeTematik(newStyles); // Update parent state
      setIsZNT(false);
    } catch (error) {
      console.error("Error mengambil warna untuk status pendaftaran:", error);
    } finally {
      setLoading(false); // 👉 End loading
    }
  };

  const handleZNTData = async (zntData: ZNTData[]) => {
    try {
      setLoading(true);
      const warnaResponse = await axios.get<ApiResponse<WarnaData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/refwarnaznt`);
      const warnaMap: Record<string, string> = {}; // Map STATUS dengan WARNA

      warnaResponse.data.data.forEach((item: WarnaData) => {
        warnaMap[item.STATUS] = item.WARNA;
      });

      const newStyles: Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> = {};

      // Proses zntData
      zntData.forEach((item) => {
        const ZNTnum = `${item.KD_PROV}${item.KD_KAB}${item.KD_KEC}${item.KD_KEL}${item.KD_ZNT}`;
        const fillColor = warnaMap[item.KD_ZNT] || "#FFFFFF"; // Default color if not found

        newStyles[ZNTnum] = {
          color: "#000000",
          weight: 0.5,
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 0.65,
        };
      });

      setWarnaData(warnaResponse.data.data);
      setSelectedTematik("Peta ZNT");
      setOnChangeTematik(newStyles); // Update parent state
      setIsZNT(true);
    } catch (error) {
      console.error("Error mengambil warna untuk peta ZNT:", error);
    } finally {
      setLoading(false); // 👉 End loading
    }
  };

  const handleSebaranZNTData = async (sebaranZNTData: SebaranZNTData[]) => {
    try {
      setLoading(true);
      const warnaResponse = await axios.get<ApiResponse<WarnaData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/refwarnaznt`);
      const warnaMap: Record<string, string> = {}; // Map STATUS dengan WARNA

      warnaResponse.data.data.forEach((item: WarnaData) => {
        warnaMap[item.STATUS] = item.WARNA;
      });

      const newStyles: Record<string, { color: string; weight: number; opacity: number; fillColor: string; fillOpacity: number }> = {};

      // Proses sebaranZNTData
      sebaranZNTData.forEach((item) => {
        const NOP = `${item.kdPropinsi}${item.kdDati2}${item.kdKecamatan}${item.kdKelurahan}${item.kdBlok}${item.noUrut}${item.kdJnsOp}`;
        const fillColor = warnaMap[item.kdZnt] || "#FFFFFF"; // Default color if not found

        newStyles[NOP] = {
          color: "#000000",
          weight: 0.5,
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 0.65,
        };
      });

      setWarnaData(warnaResponse.data.data);
      setSelectedTematik("Sebaran ZNT");
      setOnChangeTematik(newStyles); // Update parent state
      setIsZNT(true);
    } catch (error) {
      console.error("Error mengambil warna untuk sebaran ZNT:", error);
    } finally {
      setLoading(false); // 👉 End loading
    }
  };

  const handleFetchData = async ({ data, selectedModal }: { data: SpptData[] | ZNTData[] | SebaranZNTData[]; selectedModal: string }) => {
    if (!data || data.length === 0) {
      return toast.error("Data Tidak Ditemukan");
    }

    if (selectedModal === "Status Pembayaran") {
      handleSPPTData(data as SpptData[]);
      return;
    }

    if (selectedModal === "Peta ZNT") {
      handleZNTData(data as ZNTData[]);
      return;
    }

    if (selectedModal === "Sebaran ZNT") {
      handleSebaranZNTData(data as SebaranZNTData[]);
    }
    return;
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: { xs: "100px", md: "20px" },
        right: `170px`,
        zIndex: 999,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: "#FFC107",
          color: "black",
          borderRadius: "50%",
          width: 48,
          height: 48,
          boxShadow: 3,
          "&:hover": { bgcolor: "#FFB300" },
        }}
      >
        <AttachMoneyIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ mt: 1 }}
      >
        <List sx={{ bgcolor: "white", borderRadius: "8px", boxShadow: 3, p: 1 }}>
          {TematikType.map((layer) => (
            <ListItemButton
              key={layer.name}
              onClick={() => {
                if (selectedTematik === layer.name) {
                  setWarnaData([]);
                  setSelectedTematik("");
                  setOnChangeTematik(null);
                  setIsZNT(false);
                  return;
                }

                if (layer.name === "Status Pendaftaran") {
                  handleStatusPendaftaran();
                  return;
                }

                setSelectedModal(layer.name);
                setShowModal(true);
              }}
              selected={selectedTematik === layer.name}
              sx={{
                "&.Mui-selected": { bgcolor: "#FFECB3", fontWeight: "bold" },
                "&:hover": { bgcolor: "#FFF9C4" },
              }}
            >
              {layer.icon}
              <ListItemText primary={layer.name} sx={{ ml: 1 }} />
            </ListItemButton>
          ))}
        </List>
        {showModal && selectedModal === "Status Pembayaran" && (
          <ModalStatusOP
            onClose={() => {
              setShowModal(false);
              handleClose();
            }}
            onFetchData={handleFetchData}
            selectedModal={selectedModal}
          />
        )}
        {showModal && selectedModal === "Peta ZNT" && (
          <ModalStatusOP
            onClose={() => {
              setShowModal(false);
              handleClose();
            }}
            onFetchData={handleFetchData}
            selectedModal={selectedModal}
            setKdKecZNT={setKdKecZNT}
            setKdKelZNT={setKdKelZNT}
            setTahunZNT={setTahunZNT}
          />
        )}
        {showModal && selectedModal === "Sebaran ZNT" && (
          <ModalStatusOP
            onClose={() => {
              setShowModal(false);
              handleClose();
            }}
            onFetchData={handleFetchData}
            selectedModal={selectedModal}
            setKdKecZNT={setKdKecZNT}
            setKdKelZNT={setKdKelZNT}
            setTahunZNT={setTahunZNT}
          />
        )}
      </Popover>
    </Box>
  );
};

export default SelectPetaTematik;
