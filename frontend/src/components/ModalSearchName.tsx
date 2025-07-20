/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import axios from "axios";
import { formatNop } from "@/utility/formatNOP";
import { GeomData } from "@/utility/Interfaces";
import toast, { Toaster } from "react-hot-toast";

interface WajibPajak {
  nmWp: string;
  alamat: string;
  nop: string;
  lokasi: string;
}

interface ModalSearchNameProps {
  open: boolean;
  onClose: () => void;
  setSearchedPolygon: React.Dispatch<React.SetStateAction<any>>;
  setFotoPersil: React.Dispatch<React.SetStateAction<any>>;
  setGeomData: React.Dispatch<React.SetStateAction<any>>;
  setSearchedNOPZoom: React.Dispatch<React.SetStateAction<any>>;
  setSearchNop: React.Dispatch<React.SetStateAction<any>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<any>>;
  onCloseDrawer: () => void;
}

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

const ModalSearchName: React.FC<ModalSearchNameProps> = ({ open, onClose, setSearchedPolygon, setFotoPersil, setGeomData, setSearchedNOPZoom, setSearchNop, setDrawerOpen, onCloseDrawer }) => {
  const [namaWp, setNamaWp] = useState("");
  const [data, setData] = useState<WajibPajak[]>([]);
  const [page, setPage] = useState(0); // TablePagination starts from 0
  const [limit, setLimit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const validateNop = (nop: string) => {
    return /^\d{2}\.\d{2}\.\d{3}\.\d{3}\.\d{3}\.\d{4}\.\d{1}$/.test(nop);
  };

  const fetchData = async (page: number, limit: number, namaWp: string) => {
    try {
      const res = await axios.get<any>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/carinama?namawp=${namaWp}&page=${page + 1}&limit=${limit}`);
      setData(res.data.data);
      setTotalRows(res.data.pagination.totalData);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    if (!namaWp.trim()) {
      setData([]);
      setTotalRows(0);
      return;
    }
    setPage(0);
    fetchData(0, limit, namaWp);
  };

  const handleSearchByName = async (nop: string) => {
    if (!validateNop(nop)) {
      toast.error("Format NOP tidak valid.");
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
      onClose();
      onCloseDrawer();
      toast.success("NOP ditemukan!!!");
    } catch (error) {
      toast.error("NOP tidak ditemukan.");
      console.error("Error fetching GeoJSON data:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNamaWp(value);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    fetchData(newPage, limit, namaWp);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0);
    fetchData(0, newLimit, namaWp);
  };

  useEffect(() => {
    if (!open) {
      setNamaWp("");
      setData([]);
      setPage(0);
      setLimit(5);
      setTotalRows(0);
    }
  }, [open]);

  return (
    <>
      <Toaster position="top-center" />
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Masukkan Nama Wajib Pajak :</DialogTitle>
        <DialogContent>
          <TextField fullWidth placeholder="Nama" value={namaWp} onChange={handleInputChange} variant="outlined" sx={{ mb: 2 }} />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              mb: 4,
              maxWidth: 100,
              bgcolor: "#FFC107", // Warna tombol
              color: "#000", // Warna teks agar kontras
              "&:hover": {
                bgcolor: "#E0A800", // Warna saat hover
              },
            }}
          >
            Cari
          </Button>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>NOP</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>Lokasi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatNop(row.nop)}</TableCell>
                    <TableCell>{row.nmWp}</TableCell>
                    <TableCell>{row.alamat}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleSearchByName(formatNop(row.nop))}
                        sx={{
                          maxWidth: 100,
                          bgcolor: "#FFC107", // Warna tombol
                          color: "#000", // Warna teks agar kontras
                          "&:hover": {
                            bgcolor: "#E0A800", // Warna saat hover
                          },
                        }}
                      >
                        Pilih
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination component="div" count={totalRows} page={page} onPageChange={handleChangePage} rowsPerPage={limit} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 20, 50]} />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="error">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalSearchName;
