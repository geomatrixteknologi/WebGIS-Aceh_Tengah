import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface UploadButtonProps {
  label: string;
  endpoint: string;
  jenis: string;
  kecamatan: string | null;
  kelurahan?: string | null;
  onUploadSuccess?: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ label, endpoint, jenis, kecamatan, kelurahan, onUploadSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length !== 2) {
      toast.error("Silakan unggah 2 file (.shp & .dbf)");
      return;
    }

    if (!kecamatan) {
      toast.error("Silakan pilih kecamatan sebelum mengunggah file.");
      return;
    }

    const formData = new FormData();
    formData.append("kecamatan", kecamatan);
    formData.append("jenis", jenis);
    if (kelurahan) {
      formData.append("kelurahan", kelurahan);
    }
    files.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "shp") {
        formData.append("shp", file);
      } else if (ext === "dbf") {
        formData.append("dbf", file);
      }
    });

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(`Berhasil mengunggah ${label}`);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        toast.error(`Terjadi kesalahan saat mengunggah ${label}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Terjadi kesalahan saat mengunggah ${label}: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <input
        type="file"
        accept=".shp,.dbf"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        className="rounded-lg px-4 py-2 text-white hover:opacity-80 transition"
        style={{
          backgroundColor: "green",
        }}
      >
        Upload {label}
      </button>
    </div>
  );
};

export default UploadButton;
