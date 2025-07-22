import { Autocomplete, Dialog, DialogContent, DialogTitle, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import UploadButton from "./UploadButton";
import axios from "axios";
import { ApiResponse, Kecamatan, Kelurahan } from "@/utility/Interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DrawerListItem = ({ title, useIcon, identifier }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [options1, setOptions1] = useState<string[]>([]);
  const [options2, setOptions2] = useState<Kelurahan[]>([]);
  const [options2Filtered, setOptions2Filtered] = useState<string[]>([]);
  const [value1, setValue1] = useState<string | null>(null);
  const [value2, setValue2] = useState<string | null>(null);
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch data kecamatan dari backend
        const response1 = await axios.get<ApiResponse<Kecamatan>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/kodekecamatan`, { withCredentials: true });
        const kecamatanData = response1.data.data.map((item) => `${item.kdKecamatan} - ${item.nmKecamatan}`);

        setOptions1(kecamatanData);

        // Fetch data kelurahan dari backend
        const response2 = await axios.get<ApiResponse<Kelurahan>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/kodekelurahan`, { withCredentials: true });
        const kelurahanData = response2.data.data;

        setOptions2(kelurahanData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

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

  return (
    <>
      <ListItem key={title} disablePadding onClick={handleModalOpen}>
        <ListItemButton>
          <ListItemIcon>{useIcon}</ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </ListItem>

      <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Upload Batas {title}
          <IconButton onClick={handleModalClose} sx={{ position: "absolute", right: 16, top: 16 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 3 }}>
          <Autocomplete
            key="autocomplete-value1"
            value={value1}
            onChange={handleOnChangeKec}
            inputValue={inputValue1}
            onInputChange={(event, newInputValue) => setInputValue1(newInputValue)}
            id="controllable-states-value1"
            options={options1}
            sx={{
              width: "100%",
              marginBottom: 3,
              "& label.Mui-focused": { color: "#898989" },
              "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#E0A800" }, "&.Mui-focused fieldset": { borderColor: "#FFC107" } },
            }}
            renderInput={(params) => <TextField {...params} label="Kecamatan" />}
          />

          {identifier !== "kelurahan" && (
            <Autocomplete
              key="autocomplete-value2"
              value={value2}
              onChange={(event, newValue) => setValue2(newValue)}
              inputValue={inputValue2}
              onInputChange={(event, newInputValue) => setInputValue2(newInputValue)}
              id="controllable-states-value2"
              options={options2Filtered}
              sx={{
                width: "100%",
                marginBottom: 3,
                "& label.Mui-focused": { color: "#898989" },
                "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#E0A800" }, "&.Mui-focused fieldset": { borderColor: "#FFC107" } },
              }}
              renderInput={(params) => <TextField {...params} label="Kelurahan" />}
            />
          )}

          <UploadButton label={title} endpoint={`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/upload/batas${title}`} jenis={identifier} kecamatan={inputValue1} kelurahan={inputValue2} onUploadSuccess={handleModalClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DrawerListItem;
