"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress, Box } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logged, register, RoleData, RoleDataAPI } from "@/utility/Interfaces";

const RegisterButton = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get<logged>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        if (res.data.data.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  // Fetch daftar role dari API
  useEffect(() => {
    axios
      .get<RoleDataAPI>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/role`)
      .then((res) => {
        if (res.data.code === 200 && Array.isArray(res.data.data)) {
          setRoles(res.data.data); // Set daftar role berdasarkan response API
        }
      })
      .catch((err) => console.error("Gagal mengambil role:", err));
  }, [router]);

  // Handle submit form register
  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await axios.post<register>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/auth/register`, { username, password, role });
      toast.success(res.data.message || "Akun berhasil dibuat!");
      setOpen(false); // Tutup modal setelah sukses
      setUsername("");
      setPassword("");
      setRole("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Pendaftaran gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Tombol Register (Hanya untuk Admin) */}
      {isAdmin && (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ bgcolor: "#FFC107", color: "#000", "&:hover": { bgcolor: "#E0A800" } }}>
            Register
          </Button>
        </Box>
      )}

      {/* Modal Register */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Register Akun Baru</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Username" variant="outlined" margin="dense" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="dense" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <TextField fullWidth select label="Role" variant="outlined" margin="dense" value={role} onChange={(e) => setRole(e.target.value)} required>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.Role}>
                {r.Role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
          <Button onClick={handleRegister} variant="contained" color="primary" disabled={loading} sx={{ bgcolor: "#FFC107", color: "#000", "&:hover": { bgcolor: "#E0A800" } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterButton;
