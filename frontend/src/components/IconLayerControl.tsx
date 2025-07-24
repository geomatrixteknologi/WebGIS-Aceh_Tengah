import { Public, Terrain } from "@mui/icons-material";
import SatelliteIcon from "@mui/icons-material/Satellite";
import RectangleRoundedIcon from "@mui/icons-material/RectangleRounded";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import MapIcon from "@mui/icons-material/Map";
import { Box, IconButton, List, ListItemButton, ListItemText, Popover, Tooltip } from "@mui/material";
import React, { JSX, useState } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const Basemap = [
  { name: "Google Map", icon: <Public /> },
  { name: "Google Satellite", icon: <SatelliteIcon /> },
  { name: "Open Street Map", icon: <MapIcon /> },
];

const Batas = [
  { name: "Batas Persil", icon: <RectangleRoundedIcon /> },
  { name: "Batas Blok", icon: <RectangleRoundedIcon /> },
  { name: "Batas Kelurahan", icon: <RectangleRoundedIcon /> },
];

const Titik = [{ name: "Titik Pendataan", icon: <ControlPointIcon /> }];

const IconLayerControl = ({ setSelectedLayer, selectedLayer, layerType, toggleZNT }: { setSelectedLayer: React.Dispatch<React.SetStateAction<string[]>>; selectedLayer: string[]; layerType: string; toggleZNT?: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  let layerTypeChoose: { name: string; icon: JSX.Element }[] = [];
  let rightBox: number = 0;

  switch (layerType) {
    case "Basemap":
      layerTypeChoose = Basemap;
      rightBox = 30;
      break;
    case "Batas":
      layerTypeChoose = Batas;
      rightBox = 100;
      break;
    case "Titik":
      layerTypeChoose = Titik;
      rightBox = 240;
      break;
    default:
      layerTypeChoose = [];
      rightBox = 0;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLayerChange = (layer: string) => {
    if (layerType === "Batas" || layerType === "Titik") {
      setSelectedLayer((prevSelected: string[]) => {
        let updatedSelection: string[];

        if (prevSelected.includes(layer)) {
          // Remove the layer if already selected
          updatedSelection = prevSelected.filter((l) => l !== layer);
        } else {
          // Add the new layer to the selection
          updatedSelection = [...prevSelected, layer];
        }
        return updatedSelection;
      });
    } else {
      setSelectedLayer([layer]); // Keep single selection for Basemap
    }

    if (layerType === "Batas" && toggleZNT) {
      toggleZNT();
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  return (
    <Box
      sx={{
        position: "absolute",
        top: { xs: "100px", md: "20px" },
        right: `${rightBox}px`,
        zIndex: 999,
      }}
    >
      {/* Tombol untuk membuka Layer Control */}
      <Tooltip title={layerType} arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            bgcolor: "#FFC107",
            color: "black",
            borderRadius: "50%",
            width: 48,
            height: 48,
            boxShadow: 3,
            "&:hover": { bgcolor: "#FFB300" },
          }}
        >
          {layerType === "Basemap" ? <Public /> : layerType === "Titik" ? <RadioButtonCheckedIcon /> : <Terrain />}
        </IconButton>
      </Tooltip>

      {/* Popover untuk daftar layer */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ mt: 1 }}
      >
        <List sx={{ bgcolor: "white", borderRadius: "8px", boxShadow: 3, p: 1 }}>
          {layerTypeChoose.map((layer) => (
            <ListItemButton
              key={layer.name}
              onClick={() => handleLayerChange(layer.name)}
              selected={selectedLayer.includes(layer.name)}
              sx={{
                "&.Mui-selected": { bgcolor: "#FFECB3", fontWeight: "bold" },
                "&:hover": { bgcolor: "#FFF9C4" },
              }}
            >
              {layer.icon}
              <ListItemText primary={layer.name} sx={{ ml: 1 }} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </Box>
  );
};

export default IconLayerControl;
