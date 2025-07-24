/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { Toaster, toast } from "react-hot-toast";
// import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
// import Image from "next/image";

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/login`, { username, password }, { withCredentials: true });

//       toast.success("Login berhasil!");

//       router.push("/maps"); //maps
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Login gagal!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box height="100vh" display="flex" justifyContent="center" alignItems="center" marginBottom={{ xs: 10, md: 0 }}>
//       <Toaster position="top-center" />

//       <Box display="flex" flexDirection={{ xs: "column-reverse", md: "row" }} justifyContent="center" alignItems="center" gap={{ xs: 0, md: 20 }}>
//         {/* Form Login */}
//         <Box p={4} bgcolor="white" boxShadow={3} borderRadius={2} textAlign="center" width={350}>
//           <Typography variant="h5" fontWeight="bold" mb={2}>
//             Login
//           </Typography>
//           <form onSubmit={handleLogin}>
//             <TextField fullWidth label="Username" variant="outlined" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
//             <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={loading}
//               sx={{
//                 mt: 2,
//                 bgcolor: "#FFC107", // Warna tombol
//                 color: "#000", // Warna teks agar kontras
//                 "&:hover": {
//                   bgcolor: "#E0A800", // Warna saat hover
//                 },
//               }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
//             </Button>
//           </form>
//         </Box>

//         {/* Gambar Logo */}
//         <Box>
//           <Image src="/geomatrix.jpg" alt="geomatrix" width={400} height={400} />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Box, Typography, TextField, Button, InputAdornment, IconButton, useMediaQuery, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff, PersonOutline, LockOutlined } from "@mui/icons-material";
import Image from "next/image";
import CopyrightIcon from "@mui/icons-material/Copyright";

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/login`, { username, password }, { withCredentials: true });
      toast.success("Login berhasil!");
      router.push("/maps");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: 'url("/peta_dunia.png")', // ← Ganti dengan file Anda
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      position="relative"
    >
      {/* logo geomatrix */}
      <Box position="absolute" top={20} left={20} zIndex={2}>
        <Image
          src="/geomatrix_G_only.png" // Ganti dengan logo Anda
          alt="Logo"
          width={64}
          height={64}
          style={{
            borderRadius: "50%", // Membulatkan logo
            objectFit: "cover", // Mengisi area secara proporsional
            // zoom: "2",
          }}
        />
      </Box>
      <Box position="absolute" top={28} left={100} zIndex={2}>
        <Typography sx={{ color: "#FFF ", fontSize: "xx-large" }}>Geotax.org</Typography>
      </Box>
      {/* logo client */}
      <Box position="absolute" top={13} right={0} zIndex={2}>
        <Image
          src="/murung raya logo.png" // Ganti dengan logo Anda
          alt="Logo"
          width={120}
          height={120}
          style={{
            objectFit: "cover", // Mengisi area secara proporsional
            borderRadius: "20%",
            // zoom: "2",
          }}
        />
      </Box>
      <Box position="absolute" top={28} right={100} zIndex={2}>
        <Typography sx={{ color: "#FFF ", fontSize: "large", textAlign: "right" }}>BADAN PENGELOLAAN KEUANGAN</Typography>
        <Typography sx={{ color: "#FFF ", fontSize: "large", textAlign: "right" }}>KABUPATEN ACEH TENGAH</Typography>
      </Box>
      <Toaster position="top-center" />
      <Box
        width={isMobile ? "90%" : 400}
        borderRadius={5}
        overflow="hidden"
        boxShadow={5}
        sx={{ p: 4, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.3)" }}
      >
        {/* Header section */}
        <Box textAlign="center" py={4} sx={{ color: "#fff" }}>
          <Typography variant="h5" fontWeight="bold" zIndex={1} position="relative">
            Login
          </Typography>
          <Typography variant="body2" zIndex={1} position="relative">
            Please Sign in to Continue
          </Typography>
        </Box>

        {/* Form Area */}
        <Box px={4} py={3}>
          <form onSubmit={handleLogin}>
            {/* Username */}
            <TextField
              fullWidth
              placeholder="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#FFF" }}>
                    <PersonOutline />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 999,
                  bgcolor: "#4F80FF",
                  color: "#fff",
                  "& input": { color: "#fff" },
                },
              }}
              required
            />

            {/* Password */}
            <TextField
              fullWidth
              placeholder="Password"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#FFF" }}>
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#FFF" }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 999,
                  bgcolor: "#4F80FF",
                  color: "#fff",
                  "& input": { color: "#fff" },
                },
              }}
              required
            />

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                mt: 2,
                py: 1.5,
                bgcolor: "#ff8c00",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#fff",
                  color: "#ff8c00",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>

            {/* Sign up text */}
          </form>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" gap={5}>
          <Typography fontSize={14} mt={2} sx={{ color: "#FFF" }}>
            <CopyrightIcon /> 2025. PT Geomatrix Teknologi Indonesia
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
