/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, Typography, Button, ListItem, ListItemButton, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";
import toast from "react-hot-toast";
import UploadProgressDialog from "./UploadProgressDialog";

const dropzoneStyle = {
  border: "2px dashed green",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  cursor: "pointer",
  backgroundColor: "#f9f9f9",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
};

const DrawerListItemImage = ({ title, useIcon }: { title: string; useIcon: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [upload, setUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const handleModalClose = () => {
    setOpenModal(false);
    setFiles([]);
  };

  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     toast.error("Pilih gambar terlebih dahulu.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   files.forEach((file) => formData.append("fotopersil", file));

  //   try {
  //     await axios.post(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/upload/fotopersil`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  //     toast.success("Berhasil mengunggah foto");
  //     handleModalClose();
  //   } catch (error) {
  //     console.error("Error uploading:", error);
  //     toast.error("Terjadi kesalahan saat mengunggah.");
  //   }
  // };

  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     toast.error("Pilih gambar terlebih dahulu.");
  //     return;
  //   }

  //   if (files.length > 5) {
  //     toast.error("Maksimal upload 5 file sekaligus.");
  //     return;
  //   }

  //   // Kumpulkan NOP dari nama file
  //   // Step 1: Validasi nama file dan hitung file per NOP
  //   const nopCountMap: Record<string, number> = {};
  //   const invalidFiles: string[] = [];

  //   for (const file of files) {
  //     const filename = file.name.split(".")[0]; // contoh: 621308001100104920_1
  //     const [nop, suffix] = filename.split("_");

  //     const isValidNop = /^\d{18}$/.test(nop);
  //     const isValidSuffix = suffix === "1" || suffix === "2";

  //     if (!isValidNop || !isValidSuffix) {
  //       invalidFiles.push(file.name);
  //       continue;
  //     }

  //     nopCountMap[nop] = (nopCountMap[nop] || 0) + 1;
  //   }

  //   // Step 2: Cek invalid format
  //   if (invalidFiles.length > 0) {
  //     toast.error(`Format nama file tidak valid: ${invalidFiles.join(", ")}`);
  //     return;
  //   }

  //   // Step 3: Cek duplikat NOP lebih dari 2 dalam sekali upload
  //   const nopsLebihDari2 = Object.entries(nopCountMap)
  //     .filter(([, count]) => count > 2)
  //     .map(([nop]) => nop);

  //   if (nopsLebihDari2.length > 0) {
  //     toast.error(`Terdapat lebih dari 2 file untuk NOP: ${nopsLebihDari2.join(", ")}`);
  //     return;
  //   }

  //   const failedUploads: string[] = [];

  //   for (const file of files) {
  //     const filename = file.name.split(".")[0]; // e.g. 621308001100104920_1
  //     const [nopRaw] = filename.split("_");

  //     if (!/^\d{18}$/.test(nopRaw)) {
  //       toast.error(`Nama file tidak valid: ${file.name} (harus mengandung NOP 18 digit)`);
  //       failedUploads.push(file.name);
  //       continue;
  //     }

  //     try {
  //       // Hitung jumlah foto yang sudah ada di backend
  //       const res = await axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/fotopersil/${nopRaw}`);
  //       const count = res.data?.imageUrls?.length || 0;

  //       if (count >= 2) {
  //         toast.error(`NOP ${nopRaw} sudah memiliki 2 foto.`);
  //         failedUploads.push(file.name);
  //         continue;
  //       }

  //       const formData = new FormData();
  //       formData.append("fotopersil", file);

  //       await axios.post(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/upload/fotopersil/${nopRaw}?count=${count}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

  //       toast.success(`Foto untuk NOP ${nopRaw} berhasil diunggah`);
  //     } catch (error) {
  //       console.error(`Upload gagal untuk ${file.name}`, error);
  //       failedUploads.push(file.name);
  //     }
  //   }

  //   if (failedUploads.length > 0) {
  //     toast.error(`Upload gagal untuk file: ${failedUploads.join(", ")}`);
  //   }

  //   setFiles([]);
  //   setOpenModal(false);
  // };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Pilih gambar terlebih dahulu.");
      return;
    }

    if (files.length > 5) {
      toast.error("Maksimal upload 5 file sekaligus.");
      return;
    }

    const nopCountMap: Record<string, number> = {};
    const invalidFiles: string[] = [];

    // Validasi nama file
    for (const file of files) {
      const filename = file.name.split(".")[0];
      const [nop, suffix] = filename.split("_");
      const isValidNop = /^\d{18}$/.test(nop);
      const isValidSuffix = suffix === "1" || suffix === "2";

      if (!isValidNop || !isValidSuffix) {
        invalidFiles.push(file.name);
        continue;
      }

      nopCountMap[nop] = (nopCountMap[nop] || 0) + 1;
    }

    if (invalidFiles.length > 0) {
      toast.error(`Format nama file tidak valid: ${invalidFiles.join(", ")}`);
      return;
    }

    const tooMany = Object.entries(nopCountMap)
      .filter(([, count]) => count > 2)
      .map(([nop]) => nop);
    if (tooMany.length > 0) {
      toast.error(`Terdapat lebih dari 2 file untuk NOP: ${tooMany.join(", ")}`);
      return;
    }

    const failedUploads: string[] = [];
    let currentIndex = 1;

    for (const file of files) {
      const filenameWithExt = file.name; // example: 621308001100104920_1.jpg
      const filenameNoExt = filenameWithExt.split(".")[0];
      const [nopRaw] = filenameNoExt.split("_");
      const [countNop] = (parseInt(filenameNoExt.split("_")[1]) - 1).toString();

      setUpload(true);
      setUploadStatus(`Mengunggah file ${currentIndex} dari ${files.length}...`);
      currentIndex++;

      try {
        // Cek apakah file dengan nama tersebut sudah ada
        const checkRes = await axios.get<any>(`${process.env.NEXT_PUBLIC_GIS_API_URL}/api/retrieve/checkfotopersil/${filenameNoExt}`, {
          withCredentials: true,
        });
        const fileExists = checkRes.data.exists;

        const formData = new FormData();
        formData.append("fotopersil", file);

        const url = fileExists ? `${process.env.NEXT_PUBLIC_GIS_API_URL}/api/upload/fotopersil/${nopRaw}?forceName=${filenameNoExt}` : `${process.env.NEXT_PUBLIC_GIS_API_URL}/api/upload/fotopersil/${nopRaw}?count=${countNop}`;

        await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });

        toast.success(`Berhasil upload ${file.name}`);
      } catch (error: any) {
        failedUploads.push(file.name);
        toast.error(`Gagal upload ${file.name}, karena ${error.response.data.message}`);
        console.log(error);
      }
    }
    setUpload(false);
    setUploadStatus(""); // reset
    setFiles([]);
    setOpenModal(false);

    if (failedUploads.length > 0) {
      toast.error(`Gagal upload: ${failedUploads.join(", ")}`);
    }
  };

  return (
    <>
      <UploadProgressDialog open={upload} text={uploadStatus} />
      <ListItem key={title} disablePadding onClick={() => setOpenModal(true)}>
        <ListItemButton>
          <ListItemIcon>{useIcon}</ListItemIcon>
          <ListItemText primary="foto persil" />
        </ListItemButton>
      </ListItem>
      <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle textAlign="center">
          Upload Foto Persil
          <IconButton onClick={handleModalClose} sx={{ position: "absolute", right: 16, top: 16 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box {...getRootProps()} sx={dropzoneStyle}>
            <input {...getInputProps()} />
            <ImageIcon sx={{ fontSize: 50, color: "green" }} />
            <Typography variant="body2">Drag & drop gambar di sini, atau klik untuk memilih file</Typography>
          </Box>

          {files.length > 0 && (
            <Box sx={{ mt: 2, maxHeight: 150, overflowY: "auto", width: "100%" }}>
              {files.map((file, index) => (
                <Typography key={index} variant="body2">
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}

          <Button onClick={handleUpload} variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "green" }}>
            Upload
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DrawerListItemImage;

// import { Box, IconButton, Typography, Button, ListItem, ListItemButton, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent } from "@mui/material";
// import React, { useState } from "react";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDropzone } from "react-dropzone";
// import ImageIcon from "@mui/icons-material/Image";
// import axios from "axios";
// import toast from "react-hot-toast";

// const dropzoneStyle = {
//   border: "2px dashed green",
//   borderRadius: "8px",
//   padding: "20px",
//   textAlign: "center" as const,
//   cursor: "pointer",
//   backgroundColor: "#f9f9f9",
//   display: "flex",
//   flexDirection: "column" as const,
//   alignItems: "center" as const,
// };

// const DrawerListItemImage = ({ title, useIcon }: { title: string; useIcon: React.ReactNode }) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/*": [] },
//     multiple: true,
//     maxFiles: 5,
//     onDrop: (acceptedFiles) => {
//       const validFiles = acceptedFiles.filter((file) => /^\d{18}\./.test(file.name));
//       if (validFiles.length < acceptedFiles.length) {
//         toast.error("Nama file harus 18 digit angka (misal: 621307000100400230.jpg)");
//       }
//       setFiles(validFiles);
//     },
//   });

//   const handleModalClose = () => {
//     setOpenModal(false);
//     setFiles([]);
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       toast.error("Pilih gambar terlebih dahulu.");
//       return;
//     }

//     for (const file of files) {
//       const fileName = file.name.split(".")[0];
//       if (!/^\d{18}$/.test(fileName)) {
//         toast.error(`Nama file ${file.name} tidak valid`);
//         continue;
//       }

//       try {
//         // Cek jumlah foto yang sudah diunggah
//         const checkRes = await axios.get<any>(`${process.env.NEXT_PUBLIC_PENDATAAN_API_URL}/api/get/getfotopersil/${fileName}`);

//         const existingFotoCount = checkRes.data?.imageUrls?.length || 0;
//         if (existingFotoCount >= 2) {
//           toast.error(`NOP ${fileName} sudah memiliki 2 foto`);
//           continue;
//         }

//         const formData = new FormData();
//         formData.append("fotopersil", file);

//         // Upload ke endpoint
//         await axios.post<any>(`${process.env.NEXT_PUBLIC_PENDATAAN_API_URL}/api/post/fotoobjekpajak/${fileName}?count=${existingFotoCount}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

//         toast.success(`Foto ${file.name} berhasil diunggah`);
//       } catch (err) {
//         console.error(err);
//         toast.error(`Gagal upload ${file.name}`);
//       }
//     }

//     handleModalClose();
//   };

//   return (
//     <>
//       <ListItem key={title} disablePadding onClick={() => setOpenModal(true)}>
//         <ListItemButton>
//           <ListItemIcon>{useIcon}</ListItemIcon>
//           <ListItemText primary="Foto Persil" />
//         </ListItemButton>
//       </ListItem>

//       <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="sm">
//         <DialogTitle textAlign="center">
//           Upload Foto Persil
//           <IconButton onClick={handleModalClose} sx={{ position: "absolute", right: 16, top: 16 }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//           <Box {...getRootProps()} sx={dropzoneStyle}>
//             <input {...getInputProps()} />
//             <ImageIcon sx={{ fontSize: 50, color: "green" }} />
//             <Typography variant="body2">Drag & drop maksimal 5 file dengan nama 18 digit</Typography>
//           </Box>

//           {files.length > 0 && (
//             <Box sx={{ mt: 2, maxHeight: 150, overflowY: "auto", width: "100%" }}>
//               {files.map((file, index) => (
//                 <Typography key={index} variant="body2">
//                   {file.name}
//                 </Typography>
//               ))}
//             </Box>
//           )}

//           <Button onClick={handleUpload} variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "green" }}>
//             Upload
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default DrawerListItemImage;
