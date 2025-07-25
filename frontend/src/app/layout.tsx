// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "WebGIS",
//   description: "GIS website for your needs",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }

// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "WebGIS",
//   description: "GIS website for your needs",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }

// // app/layout.tsx (atau src/app/layout.tsx)
// import type { Metadata } from "next";
// import "./globals.css"; // CSS global Anda

// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"; // Untuk integrasi MUI di App Router
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "../../src/theme"; // Sesuaikan path jika berbeda

// // Import font Sora lagi di sini untuk mendapatkan className
// import { Sora } from "next/font/google";

// const sora = Sora({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={sora.className}>
//       {" "}
//       {/* Terapkan className font di sini */}
//       <body>
//         <AppRouterCacheProvider options={{ enableCssLayer: true }}>
//           {/* Penting untuk MUI v5 di Next.js App Router */}
//           <ThemeProvider theme={theme}>{children}</ThemeProvider>
//         </AppRouterCacheProvider>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx (atau src/app/layout.tsx)
import type { Metadata } from "next";
import "./globals.css"; // CSS global Anda

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme"; // Import tema yang sudah kita buat

// Import font Sora lagi di sini untuk mendapatkan className
// yang akan diterapkan ke tag <html>

export const metadata: Metadata = {
  title: "Login Page", // Ganti dengan judul aplikasi Anda
  description: "A responsive login page built with Next.js and Material UI", // Ganti deskripsi
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* {" "} */}
      {/* Terapkan className font di sini */}
      <body>
        {/* <AppRouterCacheProvider options={{ enableCssLayer: true }}> */}
        <ThemeProvider theme={theme}>
          {/* {" "} */}
          {/* Gunakan tema yang diimpor */}
          {children}
        </ThemeProvider>
        {/* </AppRouterCacheProvider> */}
      </body>
    </html>
  );
}
