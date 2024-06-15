import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  Typography,
  Backdrop,
  Fade,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import baseURL from '../Assets/baseurl';
// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function SoldInventoryTable({ filter, search }) {
  const [rows, setRows] = useState([]);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectedPhoneData, setSelectedPhoneData] = useState({});

  useEffect(() => {
    const fetchSoldData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const verifyToken = jwtDecode(token);

        const response = await axios.post(
          `${baseURL}/mobile/getsold`,
          {
            Email: verifyToken.email,
            CNIC: verifyToken.cnic,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          setRows(response.data.data);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching sold data:', error);
      }
    };

    fetchSoldData();
  }, []);

  const handleOpenInfoModal = (phone) => {
    setSelectedPhoneData(phone);
    setOpenInfoModal(true);
  };

  const handleCloseModals = () => {
    setOpenInfoModal(false);
  };

  const createRows = (rows) => {
    let filteredRows = rows;
    if (filter.brand !== '') {
      filteredRows = filteredRows.filter((row) => row.BrandName === filter.brand);

      if (filter.model !== '') {
        filteredRows = filteredRows.filter((row) => row.Model === filter.model);
      }
    }

    if (filter.status !== '') {
      filteredRows = filteredRows.filter((row) => row.NetworkStatus === filter.status);
    }

    return filteredRows.map((row) => (
      <TableRow key={row._id}>
        <TableCell>{row.IMEIList.join('\n')}</TableCell>
        <TableCell>{row.BrandName}</TableCell>
        <TableCell>{row.Model}</TableCell>
        <TableCell>{row.Color}</TableCell>
        <TableCell>{row.SellingPrice}</TableCell>
        <TableCell>{row.NetworkStatus}</TableCell>
        <TableCell>{row.PurchaseDate}</TableCell>
        <TableCell>
          <IconButton onClick={() => handleOpenInfoModal(row)} color="inherit">
            <InfoIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  const searchingRows = () => {
    return rows.filter((row) => {
      for (let i = 0; i < row.IMEIList.length; i++) {
        let temp = row.IMEIList[i];
        if (temp.includes(search)) {
          return row;
        }
      }
      return false;
    });
  };

  const searchLastIMEIDigits = (row) => {
    for (let i = 0; i < row.IMEIList.length; i++) {
      let temp = row.IMEIList[i];
      let checkValue = temp.slice(temp.length - search.length, temp.length);
      if (search === checkValue) {
        return row;
      }
    }
    return false;
  };

  const mappingRows = () => {
    let newRows = [];

    if (!search || search.length === 0) {
      return createRows(rows);
    } else if (search.length <= 4 && search.length > 0) {
      newRows = rows.filter((row) => searchLastIMEIDigits(row));

      if (newRows.length === 0) {
        newRows = searchingRows();
      }

      return createRows(newRows);
    } else if (search.length > 4) {
      return createRows(searchingRows());
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="sold stocks table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bolder' }}>IMEI</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Brand</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Model</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Color</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Price</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Network Status</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Sold Date</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingRows()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Info Modal */}
      <Modal
        open={openInfoModal}
        onClose={handleCloseModals}
        aria-labelledby="info-modal-title"
        aria-describedby="info-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openInfoModal}>
          <Box sx={modalStyle}>
            <Typography id="info-modal-title" variant="h6" component="h2" gutterBottom>
              Phone and Customer Information
            </Typography>
            {selectedPhoneData && selectedPhoneData.Purchaser && (
              <Typography id="info-modal-description" sx={{ mt: 2 }}>
                <strong>Purchased Price:</strong> {selectedPhoneData.PurchasingPrice.toLocaleString()}<br />
                <strong>Sold Price:</strong> {selectedPhoneData.SellingPrice.toLocaleString()}<br />
                <strong>Purchased Date:</strong>  {selectedPhoneData.PurchaseDate ? new Date(selectedPhoneData.PurchaseDate).toLocaleDateString() : 'N/A'}<br />
                <strong>Purchaser Name:</strong> {selectedPhoneData.Purchaser.Name}<br />
                <strong>Purchaser CNIC:</strong> {selectedPhoneData.Purchaser.CNIC}<br />
                <strong>Purchaser Address:</strong> {selectedPhoneData.Purchaser.Address}<br />
                <strong>Purchaser Phone Number:</strong> {selectedPhoneData.Purchaser.PhoneNumber}<br />
                <strong>Seller Name:</strong> {selectedPhoneData.Customer.Name}<br />
                <strong>Seller CNIC:</strong> {selectedPhoneData.Customer.CNIC}<br />
                <strong>Seller Address:</strong> {selectedPhoneData.Customer.Address}<br />
                <strong>Seller Phone Number:</strong> {selectedPhoneData.Customer.PhoneNumber}<br />
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
