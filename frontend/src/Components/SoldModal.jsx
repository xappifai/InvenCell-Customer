import React, { useState } from 'react';
import { Modal, Backdrop, Fade, TextField, Button, Typography } from '@mui/material';

export default function SoldModal({ open, handleClose, phoneData }) {
  const [soldPrice, setSoldPrice] = useState('');

  const handleSold = () => {
    // Handle the sold action (e.g., update database, etc.)
    
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6">Phone Details (Sold)</Typography>
          <Typography >IMEI: {phoneData.imei}</Typography>
          <Typography>Brand: {phoneData.brand}</Typography>
          <Typography>Model: {phoneData.model}</Typography>
          <Typography>Color: {phoneData.color}</Typography>
          <Typography>Price: {phoneData.price}</Typography>
          <TextField
            label="Sold Price"
            type="number"
            value={soldPrice}
            onChange={(e) => setSoldPrice(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSold}>
            Mark as Sold
          </Button>
        </div>
      </Fade>
    </Modal>
  );
}
