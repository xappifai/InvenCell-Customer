import React, { useState } from 'react';
import { Modal, Backdrop, Fade, TextField, Button, Typography } from '@mui/material';

export default function DeleteModal({ open, handleClose, phoneData }) {
  const [password, setPassword] = useState('');

  const handleDelete = () => {
    // Handle the delete action (e.g., verify password, update database, etc.)
    console.log('Phone deleted with password:', password);
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
          <Typography variant="h6">Phone Details (Delete)</Typography>
          <Typography>IMEI: {phoneData.imei}</Typography>
          <Typography>Brand: {phoneData.brand}</Typography>
          <Typography>Model: {phoneData.model}</Typography>
          <Typography>Color: {phoneData.color}</Typography>
          <Typography>Price: {phoneData.price}</Typography>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Phone
          </Button>
        </div>
      </Fade>
    </Modal>
  );
}
