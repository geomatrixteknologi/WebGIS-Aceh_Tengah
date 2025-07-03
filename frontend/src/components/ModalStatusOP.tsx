import { IconButton, TextField, Button, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiResponse, Kecamatan, Kelurahan, SebaranZNTData, SpptData, ZNTData } from "@/utility/Interfaces";

interface ModalStatusOPProps {
  onFetchData: ({ data, selectedModal }: { data: SpptData[] | ZNTData[] | SebaranZNTData[]; selectedModal: string }) => void;
  onClose: () => void;
  selectedModal: string;
  setKdKecZNT?: React.Dispatch<React.SetStateAction<string>>;
  setKdKelZNT?: React.Dispatch<React.SetStateAction<string>>;
  setTahunZNT?: React.Dispatch<React.SetStateAction<string>>;
}

const formatTahun = (value: string) => value.replace(/\D/g, "").slice(0, 4);

const validateTahun = (tahun: string) => /^\d{4}$/.test(tahun);

const ModalStatusOP: React.FC<ModalStatusOPProps> = ({ onFetchData, onClose, selectedModal, setKdKecZNT, setKdKelZNT, setTahunZNT }) => {
  const [tahun, setTahun] = useState("");
  const [error, setError] = useState("");
  const [options1, setOptions1] = useState<string[]>([]);
  const [options2, setOptions2] = useState<Kelurahan[]>([]);
  const [options2Filtered, setOptions2Filtered] = useState<string[]>([]);
  const [value1, setValue1] = useState<string | null>(null);
  const [value2, setValue2] = useState<string | null>(null);
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch data kecamatan dari backend
        const response1 = await axios.get<ApiResponse<Kecamatan>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/kodekecamatan`);
        const kecamatanData = response1.data.data.map((item) => `${item.kdKecamatan} - ${item.nmKecamatan}`);

        setOptions1(kecamatanData);

        // Fetch data kelurahan dari backend
        const response2 = await axios.get<ApiResponse<Kelurahan>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/kodekelurahan`);
        const kelurahanData = response2.data.data;

        setOptions2(kelurahanData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    if (selectedModal === "Peta ZNT" || selectedModal === "Sebaran ZNT") {
      fetchOptions();
    }
  }, [selectedModal]);

  const handleOnChangeKec = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    setValue1(newValue);

    // split newValue ambil kode kecamatan
    const kdKecVal = newValue?.split(" - ")[0];

    // jalanin filter dari data kelurahandata1 di filter berdasarkan kode kecamatan
    const filteredData = options2.filter((item) => item.kdKecamatan === kdKecVal);

    // mapping hasil filter menjadi  ( ${kdKelurahan }- ${nmKelurahan})
    const mapFilteredData = filteredData.map((item) => `${item.kdKelurahan} - ${item.nmKelurahan}`);

    // simpan ke state setOptions2Filtered
    setOptions2Filtered(mapFilteredData);
  };

  const handleTahunChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedTahun = formatTahun(e.target.value);
    setTahun(formattedTahun);
    setError(validateTahun(formattedTahun) ? "" : "Format Tahun tidak valid (XXXX)");
  };

  const handleButtonClick = async () => {
    if (!validateTahun(tahun)) {
      setError("Format Tahun tidak valid.");
      return;
    }

    try {
      let response;
      if (selectedModal === "Status Pembayaran") {
        response = await axios.get<ApiResponse<SpptData>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/spptbytahun?tahun=${tahun}`);
      } else if (selectedModal === "Peta ZNT" && setKdKecZNT && setKdKelZNT && setTahunZNT) {
        // get kode kecamatan from inputValue1
        const kdkec = inputValue1.split(" - ")[0];
        // get kode kelurahan from inputValue2
        const kdkel = inputValue2.split(" - ")[0];

        setKdKecZNT(kdkec);
        setKdKelZNT(kdkel);
        setTahunZNT(tahun);

        response = await axios.get<ApiResponse<ZNTData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataszntbykeckeltahun?kdkec=${kdkec}&kdkel=${kdkel}&tahun=${tahun}`);
      } else if (selectedModal === "Sebaran ZNT" && setKdKecZNT && setKdKelZNT && setTahunZNT) {
        const kdkec = inputValue1.split(" - ")[0];
        const kdkel = inputValue2.split(" - ")[0];

        setKdKecZNT(kdkec);
        setKdKelZNT(kdkel);
        setTahunZNT(tahun);

        response = await axios.get<ApiResponse<SebaranZNTData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/sebaranznt?kdkec=${kdkec}&kdkel=${kdkel}&tahun=${tahun}`);
      }
      if (response) {
        onFetchData({ data: response.data.data, selectedModal });
      }
      setTahun("");
      onClose();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Tahun tidak ditemukan.");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={isMobile ? "xs" : "sm"}>
      <DialogTitle>
        Pilih {selectedModal === "Peta ZNT" || selectedModal === "Sebaran ZNT" ? "Kecamatan, Kelurahan, dan Tahun" : "Tahun"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedModal === "Peta ZNT" || selectedModal === "Sebaran ZNT" ? (
          <>
            <Autocomplete
              key="autocomplete-value1"
              value={value1}
              onChange={handleOnChangeKec}
              inputValue={inputValue1}
              onInputChange={(event, newInputValue) => setInputValue1(newInputValue)}
              options={options1}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Kecamatan" margin="dense" />}
            />
            <Autocomplete
              key="autocomplete-value2"
              value={value2}
              onChange={(event, newValue) => setValue2(newValue)}
              inputValue={inputValue2}
              onInputChange={(event, newInputValue) => setInputValue2(newInputValue)}
              options={options2Filtered}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Kelurahan" margin="dense" />}
            />
          </>
        ) : null}

        <TextField label="Tahun" value={tahun} onChange={handleTahunChange} error={!!error} helperText={error} fullWidth margin="dense" />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleButtonClick}
          variant="contained"
          disabled={selectedModal === "Peta ZNT" || selectedModal === "Sebaran ZNT" ? !(inputValue1 && inputValue2 && validateTahun(tahun)) : !validateTahun(tahun)}
          sx={{ bgcolor: "#FFC107", color: "#000", "&:hover": { bgcolor: "#E0A800" } }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalStatusOP;
