"use client";
import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Card, CardContent, Slide, Fade, IconButton, SvgIcon, TableContainer, Table, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import axios from "axios";
import { formatRupiah } from "@/utility/FormatRupiah";
import toast from "react-hot-toast";
import Image from "next/image";
import AxiosError from "axios";
import { formatRibuan } from "@/utility/FormatRibuan";
import { getPolygonCenter } from "@/utility/GetPolygonCenter";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import CancelIcon from "@mui/icons-material/Cancel";
import { GeomData, LandData } from "@/utility/Interfaces";

interface LandDrawerProps {
  open: boolean;
  onClose: () => void;
  searchNop: string;
  geomData: GeomData;
  fotoPersil: string[] | null;
}

interface ApiResponse<T> {
  data: T;
}

const LandDrawer: React.FC<LandDrawerProps> = ({ open, onClose, searchNop, geomData, fotoPersil }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [landData, setLandData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchNop) return;

    setLoading(true);
    axios
      .get<ApiResponse<LandData>>(`${process.env.NEXT_PUBLIC_PBB_API_URL}/api/retrieve/detailnop?nop=${searchNop}`, { withCredentials: true })
      .then((response) => {
        setLandData(response.data.data);
      })
      .catch(async (error) => {
        if (error instanceof AxiosError && (await error).status === 404) {
          toast.error("Nomor Objek Pajak tidak ditemukan.");
          setLandData(null);
        } else {
          console.error("Terjadi kesalahan saat mengambil data:", error);
          toast.error("Terjadi kesalahan server.");
        }
      });

    setLoading(false);
  }, [searchNop, fotoPersil]);

  const openStreetView = () => {
    let center = { lat: 0, lng: 0 };

    if (geomData.type === "Polygon") {
      center = getPolygonCenter(geomData.coordinates[0]); // Single polygon
    } else if (geomData.type === "MultiPolygon") {
      const coordinates = geomData.coordinates.flat(2); // Flatten to treat all as one set of polygons
      center = getPolygonCenter(coordinates);
    }
    const googleStreetViewURL = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${center.lat},${center.lng}`;
    window.open(googleStreetViewURL, "_blank");
  };

  return (
    <>
      <Fade in={open} timeout={500}>
        <Box
          sx={{
            position: "absolute",
            top: { xs: "170px", md: "120px" },
            left: 35, // Jangan ubah posisi, biar Fade bekerja dengan baik
            zIndex: 999,
          }}
        >
          <Slide direction="right" in={open} mountOnEnter unmountOnExit>
            <Card
              sx={{
                width: "100%",
                maxWidth: { xs: "90vw", sm: 300, md: 400 },
                height: "auto",
                maxHeight: { xs: "95vh", md: "85vh" },
                borderRadius: 4,
                boxShadow: 3,
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  // overflowY: "auto",
                  maxHeight: { xs: "70vh", md: "85vh" }, // scrollable di mobile
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontSize={{ xs: "1rem", sm: "1.25rem" }}>
                    Informasi Objek Pajak
                  </Typography>
                  <IconButton
                    onClick={onClose}
                    sx={{
                      bgcolor: "#FFC107",
                      color: "#FFF",
                      "&:hover": {
                        bgcolor: "#e73d3d",
                        color: "#FFF",
                      },
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>

                {loading ? (
                  <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
                ) : landData ? (
                  <Box sx={{ mt: 2 }}>
                    {fotoPersil?.length ? (
                      <Swiper pagination={{ clickable: true }} navigation={true} modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} style={{ borderRadius: 12 }}>
                        {fotoPersil.map((url, index) => (
                          <SwiperSlide key={index}>
                            <Box
                              sx={{
                                width: "100%",
                                height: { xs: 180, sm: 220, md: 250 },
                                position: "relative",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <Image src={url} alt={`Foto Persil ${index + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            </Box>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <Box display="flex" justifyContent="center" mt={2}>
                        <Image
                          src="/placeholder.png"
                          alt="No Image Available"
                          width={280}
                          height={200}
                          style={{
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>
                    )}

                    <Box display="flex" justifyContent="center" mt={2}>
                      <SvgIcon onClick={openStreetView} sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                          <path fill="#43a047" d="M39.25,8.25l-12,12L8.1,39.4c-0.36-0.4-0.69-0.83-0.96-1.3C6.41,36.9,6,35.5,6,34V14	c0-4.42,3.58-8,8-8h19.5c1.64,0,3.17,0.47,4.47,1.27C38.43,7.56,38.86,7.88,39.25,8.25z"></path>
                          <path fill="#cfd8dc" d="M42,14.5V34c0,4.42-3.58,8-8,8H14c-1.64,0-3.16-0.49-4.42-1.34c-0.54-0.35-1.04-0.78-1.48-1.26	l19.15-19.15l12-12c0.48,0.44,0.91,0.93,1.27,1.47C41.46,11.08,42,12.73,42,14.5z"></path>
                          <path
                            fill="#eceff1"
                            d="M20,14.048h-5.048v1.835h2.446c-0.202,0.422-0.491,0.789-0.844,1.087l0.001,0.001h-0.001	c-0.558,0.467-1.277,0.747-2.06,0.747c-1.361,0-2.524-0.846-2.992-2.041c-0.142-0.364-0.22-0.759-0.22-1.172	c0-0.666,0.202-1.283,0.549-1.796l0.061-0.079c0.58-0.811,1.529-1.337,2.603-1.337c0.858,0,1.637,0.335,2.212,0.886l1.532-1.712	C17.257,9.56,15.939,9,14.494,9c-1.9,0-3.575,0.964-4.566,2.428c-0.594,0.88-0.941,1.939-0.941,3.079	c0,0.904,0.217,1.757,0.604,2.51c0.913,1.779,2.765,2.997,4.903,2.997c1.466,0,2.799-0.573,3.787-1.509l-0.001-0.001	C19.34,17.504,20,16.081,20,14.508V14.048z"
                          ></path>
                          <path fill="#eceff1" d="M40.52,9.72l-11.8,11.8L9.58,40.66c-0.54-0.35-1.04-0.78-1.48-1.26c-0.36-0.4-0.69-0.83-0.96-1.3	l19.13-19.13l11.7-11.7c0.46,0.29,0.89,0.61,1.28,0.98C39.73,8.69,40.16,9.18,40.52,9.72z"></path>
                          <path
                            fill="#ffb300"
                            d="M42,14.5c0,4.69-3.81,8.5-8.5,8.5c-1.77,0-3.42-0.54-4.78-1.48c-0.54-0.36-1.03-0.79-1.47-1.27	c-0.37-0.39-0.69-0.82-0.98-1.28c-0.8-1.3-1.27-2.83-1.27-4.47C25,9.81,28.81,6,33.5,6c1.64,0,3.17,0.47,4.47,1.27	c0.46,0.29,0.89,0.61,1.28,0.98c0.48,0.44,0.91,0.93,1.27,1.47C41.46,11.08,42,12.73,42,14.5z"
                          ></path>
                          <path fill="#ffb300" d="M42,27.46v6.8c0,4.42-3.58,8-8,8H22V31.22c0-0.84,0.34-1.64,0.96-2.21c0.75-0.69,1.95-1.61,3.56-2.4	c1.8-0.89,4.14-1.61,6.98-1.61s5.18,0.72,6.98,1.61C41.04,26.88,41.54,27.17,42,27.46z"></path>
                          <path fill="#f57c00" d="M40.48,26.61L33.5,34l-6.98-7.39c1.8-0.89,4.14-1.61,6.98-1.61S38.68,25.72,40.48,26.61z"></path>
                        </svg>
                      </SvgIcon>
                    </Box>

                    <TableContainer
                      component={Paper}
                      sx={{
                        maxHeight: { xs: "30vh", sm: "35vh" },
                        mt: 2,
                        overflow: "auto",
                      }}
                    >
                      <Table stickyHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Nomor Objek Pajak</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                {landData.kdPropinsi}.{landData.kdDati2}.{landData.kdKecamatan}.{landData.kdKelurahan}.{landData.kdBlok}.{landData.noUrut}.{landData.kdJnsOp}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Nama Wajib Pajak</TableCell>
                            <TableCell>{landData.subjekPajak.nmWp}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Alamat</TableCell>
                            <TableCell>{landData.jalanOp}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>RT/RW</TableCell>
                            <TableCell>
                              {landData.rtOp} / {landData.rwOp}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Luas Bumi</TableCell>
                            <TableCell>{formatRibuan(Number(landData.totalLuasBumi))} m²</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Luas Bangunan</TableCell>
                            <TableCell>{formatRibuan(Number(landData.totalLuasBng))} m²</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>NJOP Tanah</TableCell>
                            <TableCell>{formatRupiah(landData.njopBumi)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>NJOP Bangunan</TableCell>
                            <TableCell>{formatRupiah(landData.njopBng)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Kode ZNT</TableCell>
                            <TableCell>{landData.datOpBumis[0]?.kdZnt}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mt: 2, color: "red" }}>
                    Data tidak ditemukan
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Box>
      </Fade>
    </>
  );
};

export default LandDrawer;
