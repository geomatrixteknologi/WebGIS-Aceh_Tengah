// src/theme.ts
"use client"; // Penting: Menandakan ini adalah komponen atau modul sisi klien

import { createTheme } from "@mui/material/styles";
import { Sora } from "next/font/google";

// Inisialisasi font Sora
const sora = Sora({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// **KUNCI:** Panggil createTheme() tanpa argumen awal.
// Ini akan menghasilkan objek tema Material UI default yang lengkap.
// let theme = createTheme(); // Mulai dengan tema default Material UI penuh

// Kemudian, timpa properti typography.fontFamily
const theme = createTheme({
  // Timpa tema yang sudah ada
  typography: {
    fontFamily: sora.style.fontFamily, // Gunakan fontFamily dari objek font Sora
  },
  // Anda juga bisa menimpa properti lain di sini jika perlu,
  // tanpa mereset seluruh tema. Misalnya:
  // palette: {
  //   primary: {
  //     main: '#ff8c00', // Warna primer Anda
  //   },
  // },
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         textTransform: 'none', // Hilangkan uppercase default
  //         // Tambahkan padding kustom di sini jika Anda ingin override default
  //         // padding: '8px 24px',
  //       },
  //     },
  //   },
  // },
});

// (Opsional) Terapkan responsiveFontSizes jika Anda ingin ukuran font otomatis responsif
// theme = responsiveFontSizes(theme); // Terapkan pada tema yang sudah dimodifikasi

export default theme;
