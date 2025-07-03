import React from "react";
import { Dialog, DialogContent, CircularProgress, Typography, Box } from "@mui/material";

interface UploadProgressDialogProps {
  open: boolean;
  text: string;
}

const UploadProgressDialog: React.FC<UploadProgressDialogProps> = ({ open, text }) => {
  return (
    <Dialog open={open} PaperProps={{ sx: { p: 3, textAlign: "center" } }}>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="success" />
          <Typography variant="body1">{text}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProgressDialog;
