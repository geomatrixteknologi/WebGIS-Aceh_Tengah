/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Collapse, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UploadIcon from "@mui/icons-material/Upload";
import DrawerListItem from "./DrawerListItem";
import DrawerListItemImage from "./UploadImage";
import LogoutButton from "./LogoutButton";
import RegisterButton from "./RegisterButton";
import AvatarProfile from "./AvatarProfile";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ModalSearchName from "./ModalSearchName";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ModalTitikPusat from "./ModalTitikPusat";

interface drawerListProps {
  setSearchedPolygon: React.Dispatch<React.SetStateAction<any>>;
  setFotoPersil: React.Dispatch<React.SetStateAction<any>>;
  setGeomData: React.Dispatch<React.SetStateAction<any>>;
  setSearchedNOPZoom: React.Dispatch<React.SetStateAction<any>>;
  setSearchNop: React.Dispatch<React.SetStateAction<any>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<any>>;
  latitudeCP: any;
  setLatitudeCP: React.Dispatch<React.SetStateAction<any>>;
  longitudeCP: any;
  setLongitudeCP: React.Dispatch<React.SetStateAction<any>>;
}

const DrawerList: React.FC<drawerListProps> = ({ setSearchedPolygon, setFotoPersil, setGeomData, setSearchedNOPZoom, setSearchNop, setDrawerOpen, latitudeCP, setLatitudeCP, longitudeCP, setLongitudeCP }) => {
  const [open, setOpen] = useState(false);
  const [openPencarian, setOpenPencarian] = useState(false);
  const [openPengaturan, setOpenPengaturan] = useState(false);
  const [OpenPencarianNama, setOpenPencarianNama] = useState(false);
  const [openPengaturanTitikPusat, setOpenPengaturanTitikPusat] = useState(false);
  // const [openPengaturanZoom, setOpenPengaturanZoom] = useState(false);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const DrawerLists = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <IconButton onClick={handleDrawerClose}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
      </List>
      <Divider />
      <List>
        <ListSubheader>Upload Batas Administrasi</ListSubheader>
        <DrawerListItem title="kelurahan" useIcon={<UploadIcon />} identifier="kelurahan" />
        <DrawerListItem title="blok" useIcon={<UploadIcon />} identifier="blok" />
        <DrawerListItem title="persil" useIcon={<UploadIcon />} identifier="persil" />
        <DrawerListItem title="ZNT" useIcon={<UploadIcon />} identifier="ZNT" />
        <DrawerListItemImage title="fotopersil" useIcon={<UploadIcon />} />
      </List>
      <Divider />
      <List>
        {/*Awal Menu Pencarian */}
        <ListItemButton onClick={() => setOpenPencarian(!openPencarian)}>
          <ListItemIcon>
            <ManageSearchIcon />
          </ListItemIcon>
          <ListItemText primary="Pencarian" />
          {openPencarian ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPencarian} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenPencarianNama(!OpenPencarianNama)}>
              <ListItemIcon>
                <ContactEmergencyIcon />
              </ListItemIcon>
              <ListItemText primary="Nama" />
            </ListItemButton>
          </List>
        </Collapse>
        {/*Akhir Menu Pencarian */}
        {/*Awal Menu Pengaturan */}
        <ListItemButton onClick={() => setOpenPengaturan(!openPengaturan)}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Pengaturan" />
          {openPengaturan ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPengaturan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenPengaturanTitikPusat(!openPengaturanTitikPusat)}>
              <ListItemIcon>
                <FilterCenterFocusIcon />
              </ListItemIcon>
              <ListItemText primary="Titik Pusat" />
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenPengaturanZoom(!openPengaturanZoom)}>
              <ListItemIcon>
                <ZoomInIcon />
              </ListItemIcon>
              <ListItemText primary="Zoom" />
            </ListItemButton> */}
          </List>
        </Collapse>
        {/*Akhir Menu Pengaturan */}
      </List>
      <Divider />
      <List>
        <AvatarProfile />
        <LogoutButton />
        <RegisterButton />
      </List>
    </Box>
  );
  return (
    <>
      <IconButton onClick={handleDrawerOpen}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={handleDrawerClose} variant="persistent">
        {DrawerLists}
      </Drawer>
      <ModalSearchName
        open={OpenPencarianNama}
        onClose={() => setOpenPencarianNama(false)}
        setSearchedPolygon={setSearchedPolygon}
        setFotoPersil={setFotoPersil}
        setGeomData={setGeomData}
        setSearchedNOPZoom={setSearchedNOPZoom}
        setSearchNop={setSearchNop}
        setDrawerOpen={setDrawerOpen}
        onCloseDrawer={handleDrawerClose}
      />
      <ModalTitikPusat
        open={openPengaturanTitikPusat}
        onClose={() => setOpenPengaturanTitikPusat(false)}
        latitudeCP={latitudeCP}
        setLatitudeCP={setLatitudeCP}
        longitudeCP={longitudeCP}
        setLongitudeCP={setLongitudeCP}
        onCloseDrawer={handleDrawerClose}
      />
    </>
  );
};

export default DrawerList;
