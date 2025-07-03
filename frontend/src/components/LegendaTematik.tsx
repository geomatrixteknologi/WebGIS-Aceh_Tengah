import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, IconButton, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatRibuan } from "@/utility/FormatRibuan";
import { ApiResponse, WarnaZNTData, ZNTData } from "@/utility/Interfaces";

interface LegendaTematikProps {
  selectedTematik: string;
  warnaData: WarnaZNTData[];
  kdKecZNT: string;
  kdKelZNT: string;
  tahunZNT: string;
}

const LegendaTematik: React.FC<LegendaTematikProps> = ({ selectedTematik, warnaData, kdKecZNT, kdKelZNT, tahunZNT }) => {
  const [warnaLegenda, setWarnaLegenda] = useState<WarnaZNTData[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDataZNT = async () => {
      try {
        // get batas znt by kec kel tahun
        const response = await axios.get<ApiResponse<ZNTData>>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/bataszntbykeckeltahun?kdkec=${kdKecZNT}&kdkel=${kdKelZNT}&tahun=${tahunZNT}`);
        const batasZNTData = response.data.data;

        const updatedWarnaData = batasZNTData
          .map((batas) => {
            const matchedWarna = warnaData.find((warna) => warna.STATUS === batas.KD_ZNT);
            if (matchedWarna) {
              return {
                id: matchedWarna.id,
                STATUS: batas.KD_ZNT,
                NIR_EKS: batas.NIR_EKS,
                NIR_ANAL: batas.NIR_ANAL,
                WARNA: matchedWarna.WARNA,
              };
            }
            return null; // Jika tidak cocok, tidak dimasukkan ke dalam array
          })
          .filter(Boolean) as WarnaZNTData[]; // Hapus nilai null

        setWarnaLegenda(updatedWarnaData);
      } catch (error) {
        console.error("Error mengambil data:", error);
      }
    };

    setWarnaLegenda(warnaData);

    if (selectedTematik === "Peta ZNT" || selectedTematik === "Sebaran ZNT") {
      fetchDataZNT();
    }
  }, [selectedTematik, warnaData, kdKecZNT, kdKelZNT, tahunZNT]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ position: "absolute", bottom: { xs: "100px", md: "150px" }, right: { xs: 10, md: 35 }, zIndex: 999 }}>
      <IconButton onClick={handleToggle} sx={{ backgroundColor: "white", borderRadius: "50%", boxShadow: 2, my: 2 }}>
        {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Legenda
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
              {warnaLegenda.length === 0 ? (
                <Typography variant="body2" color="error">
                  Data tidak ditemukan
                </Typography>
              ) : selectedTematik === "Peta ZNT" || selectedTematik === "Sebaran ZNT" ? (
                // Show Material UI Table for "Peta ZNT"
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>KD_ZNT</TableCell>
                        <TableCell>NIR_EKS</TableCell>
                        <TableCell>NIR_ANAL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {warnaLegenda.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: item.WARNA,
                                border: "1px solid #000",
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.STATUS}</TableCell>
                          <TableCell>{item.NIR_EKS ? formatRibuan(item.NIR_EKS) : ""}</TableCell>
                          <TableCell>{item.NIR_ANAL ? formatRibuan(item.NIR_ANAL) : ""}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                // Default Legend Display for other Tematik
                warnaLegenda.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, backgroundColor: item.WARNA, border: "1px solid #000" }} />
                    <Typography variant="body2">{item.STATUS}</Typography>
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Slide>
    </Box>
  );
};

export default LegendaTematik;
