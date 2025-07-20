/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

interface ModalTitikPusatProps {
  open: boolean;
  onClose: () => void;
  onCloseDrawer: () => void;
  latitudeCP: any;
  setLatitudeCP: React.Dispatch<React.SetStateAction<any>>;
  longitudeCP: any;
  setLongitudeCP: React.Dispatch<React.SetStateAction<any>>;
}

const ModalTitikPusat: React.FC<ModalTitikPusatProps> = ({ open, onClose, onCloseDrawer, latitudeCP, setLatitudeCP, longitudeCP, setLongitudeCP }) => {
  const handleSubmit = async (lat: number, long: number) => {
    const latNum = Number(lat);
    const longNum = Number(long);

    if (isNaN(latNum) || isNaN(longNum)) {
      toast.error("Latitude dan Longitude harus berupa angka!");
      return;
    }

    try {
      const response = await axios.put<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/put/updatecenterpoint`, { latitude: latNum, longitude: longNum }, { withCredentials: true });

      if (response.data.code === 200) {
        toast.success(response.data.message);
        onClose();
        onCloseDrawer();
      }
    } catch (error: any) {
      if (error) {
        toast.error(error.response?.data?.message || "pembaharuan titik pusat gagal!");
      }
    }

    console.log("Lat:", latNum, "Long:", longNum);
    // lanjutkan proses lainnya jika perlu
  };

  return (
    <>
      <Toaster position="top-center" />
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Masukkan Koordinat Titik Pusat :</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Latitude"
            type="text"
            placeholder="x.xxxxx"
            value={latitudeCP}
            onChange={(e) => {
              const value = e.target.value;
              if (/^-?\d*\.?\d*$/.test(value)) {
                setLatitudeCP(value);
              }
            }}
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Longitude"
            type="text"
            placeholder="xxx.xxxx"
            value={longitudeCP}
            onChange={(e) => {
              const value = e.target.value;
              if (/^-?\d*\.?\d*$/.test(value)) {
                setLongitudeCP(value);
              }
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => handleSubmit(latitudeCP, longitudeCP)}
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
            Simpan
          </Button>
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

export default ModalTitikPusat;
