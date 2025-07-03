import { Box, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { logged } from "@/utility/Interfaces";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get<logged>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(res.data.loggedIn);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/logout`, {}, { withCredentials: true });
      if (res.status && res.status === 200) {
        toast.success("Login berhasil!");
      }

      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout gagal!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!isLoggedIn || loading}
          sx={{
            mt: 2,
            maxWidth: 100,
            bgcolor: "#FFC107", // Warna tombol
            color: "#000", // Warna teks agar kontras
            "&:hover": {
              bgcolor: "#E0A800", // Warna saat hover
            },
          }}
          onClick={handleLogout}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Logout"}
        </Button>
      </Box>
    </>
  );
};

export default LogoutButton;
