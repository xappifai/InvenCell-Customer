import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import generatePDF from "../Invoice/GeneratePDFButton"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Divider,
  Select, MenuItem, InputLabel, FormControl,
  Backdrop,
  Fade,
  Snackbar,
  
} from '@mui/material';

// import 'rsuite/DatePicker/styles/index.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CurrencyExchangeTwoToneIcon from '@mui/icons-material/CurrencyExchangeTwoTone';

import config from "../Assets/baseurl.js"
import baseURL from '../Assets/baseurl.js';

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
const contentStyle = {
  maxHeight: '70vh',
  overflowY: 'auto',
};

export default function PhoneInventoryTable({ open, filter, setFilter, onClose, search }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSoldModal, setOpenSoldModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [openExchangeModal, setOpenExchangeModal] = useState(false);
  const [IMEIList, setIMEIList] = useState(['']);
  const [selectedPhoneData, setSelectedPhoneData] = useState({});
  const [soldPrice, setSoldPrice] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCNIC, setCustomerCNIC] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [originalRows, setOriginalRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [difference, setDifference] = useState(0);
  const [profitStatus, setProfitStatus] = useState(false);
  const [brandModels, setBrandModels] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [exchangeDetails, setExchangeDetails] = useState({
     CustomerName:'',
     CustomerAddress:'',
     CustomerPhoneNumber:'',
     CustomerCNIC:'',
    exchangeBrand: '',
    exchangeModel: '',
    IMEIList: '',
    Storage:'',
    exchangeColor: '',
    exchangeNetworkStatus: '',
    newPhonePrice:'',
    oldPhonePrice:'',
    exchangeDate: '',
    Difference: 0,
  });

  const handleExchangeDateChange = (date) => {
    setExchangeDetails({ ...exchangeDetails, exchangeDate: date });
  };
  const handleExchangedCustomerName = (customername) => {
    setExchangeDetails({ ...exchangeDetails, CustomerName: customername });
  };
  const handleExchangedCustomerPhoneNumber = (phoneNumber) => {
    setExchangeDetails({ ...exchangeDetails, CustomerPhoneNumber: phoneNumber });
  };
  const handleExchangeCNIC = (cnic) => {
    setExchangeDetails({ ...exchangeDetails, CustomerCNIC: cnic });
  };
  const handleExchangeAddress = (address) => {
    setExchangeDetails({ ...exchangeDetails, CustomerAddress: address });
  };
  const handleExchangeStorage = (storage) => {
    setExchangeDetails({ ...exchangeDetails, Storage: storage });
  };

  const handleExchangeChange = (e) => {
    const { name, value } = e.target;
    setExchangeDetails({
      ...exchangeDetails,
      [name]: value,
    });
  
    if (name === 'additionalCost') {
      const newDifference = parseFloat(soldPrice) - parseFloat(value);
      setDifference(newDifference);
      setExchangeDetails({ ...exchangeDetails, Difference: newDifference, newPhonePrice: value });
    }
    if (name === 'exchangeStorage') {
      
      setExchangeDetails({ ...exchangeDetails, Storage: value });
    }
  
    // Update the exchangeStorage when the exchangeModel changes
  };
  

  const handleAddIMEI = () => {
    setIMEIList([...IMEIList, '']);
  };

  const handleIMEIChange = (index, value) => {
    const updatedIMEIList = [...IMEIList];
    updatedIMEIList[index] = value;
    setIMEIList(updatedIMEIList);
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            const verifyToken = jwtDecode(token);
            const response = await axios.post(`${baseURL}/mobile/get`, {
                Email: verifyToken.email,
                CNIC: verifyToken.cnic,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            

            if (response.data.success && Array.isArray(response.data.data)) {
                // Flatten the mobile data
                const mobileData = response.data.data.flatMap(item => item.Mobile);
                setOriginalRows(mobileData);
                setFilteredRows(mobileData); // Initialize filteredRows with the original data
            } else {
                console.error('Unexpected response data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    fetchInventoryData();
}, []);




  const handleModalOpen = (phone, modalSetter) => {
    setSelectedPhoneData(phone);
    
    modalSetter(true);
  };

  const handleModalClose = () => {
    setOpenDeleteModal(false);
    setOpenSoldModal(false);
    setOpenInfoModal(false);
    setOpenExchangeModal(false);
  };

  const handleExchangeConfirm = async () => {
    setLoading(true);
    setSnackbarMessage('Processing exchange...');
    setSnackbarOpen(true);
    const soldDate = Date.now();
    const token = localStorage.getItem('token');
    const verifyToken = jwtDecode(token);
    
    
  
    const data = {
      IMEIList: selectedPhoneData.IMEIList,
      SellingPrice: exchangeDetails.oldPhonePrice,
      CustomerName: exchangeDetails.CustomerName,
      CustomerCNIC: exchangeDetails.CustomerCNIC,
      CustomerAddress: exchangeDetails.CustomerAddress,
      CustomerPhoneNumber: exchangeDetails.CustomerPhoneNumber,
    };
    console.log(data)
    
    try {
      const response = await axios.post(`${baseURL}/mobile/marksold`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.success) {
        

        console.log('Phone marked as sold successfully');
      } else {
        console.error('Failed to mark phone as sold:', response.data.message);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  
    // Construct the request body for the new phone
    const requestBody = {
      Email: verifyToken.email,
      CNIC: verifyToken.cnic,
      BrandName: exchangeDetails.exchangeBrand,
      Color: exchangeDetails.exchangeColor,
      Model: exchangeDetails.exchangeModel,
      PurchasingPrice: exchangeDetails.newPhonePrice,
      NetworkStatus: exchangeDetails.exchangeNetworkStatus,
      IMEIList: exchangeDetails.IMEIList,
      Storage:exchangeDetails.Storage,
      PurchaseDate: soldDate,
      CustomerName: exchangeDetails.CustomerName,
      CustomerCNIC: exchangeDetails.CustomerCNIC,
      CustomerAddress: exchangeDetails.CustomerAddress,
      CustomerPhoneNumber: exchangeDetails.CustomerPhoneNumber,
      PurchaserName: verifyToken.name,
      PurchaserCNIC: verifyToken.cnic,
      PurchaserAddress: verifyToken.address,
      PurchaserPhoneNumber: verifyToken.phoneNumber,
    };
  console.log(requestBody)
    try {
      const response = await fetch(`${baseURL}/mobile/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        console.log('Data added successfully:');
      } else {
        console.error('Failed to add data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    // Generate and download the PDF invoice
    const invoiceData = {
      date: formatDate(new Date(soldDate).toDateString()),
      
      billTo: {
        name: exchangeDetails.CustomerName,
        phoneNumber: exchangeDetails.CustomerPhoneNumber,
        address: exchangeDetails.CustomerAddress,
      },
      from: {
        name: verifyToken.name,
                phoneNumber: verifyToken.phoneNumber,
                address: verifyToken.address,
      },
      items: [
        {
          description: `${selectedPhoneData.BrandName} ${selectedPhoneData.Model} ${selectedPhoneData.Color} ${selectedPhoneData.Storage} ${selectedPhoneData.NetworkStatus}`,
          imei: selectedPhoneData.IMEIList.join(', '),
          price: exchangeDetails.oldPhonePrice,
          total: exchangeDetails.oldPhonePrice,
        },
      ],
      exchangeItems: exchangeDetails.exchangeBrand ? [
        {
          description: `${exchangeDetails.exchangeBrand} ${exchangeDetails.exchangeModel} ${exchangeDetails.exchangeColor} ${exchangeDetails.Storage} ${exchangeDetails.NetworkStatus} `,
          imei: exchangeDetails.IMEIList.join(', '),
          price: exchangeDetails.newPhonePrice,
          total: exchangeDetails.newPhonePrice,
        },
      ] : [],
      totalAmount: exchangeDetails.oldPhonePrice - exchangeDetails.newPhonePrice,
      
    };
    setSnackbarMessage('Phone Exchaned Successfully');
    
    generatePDF(invoiceData, `Invoice_${Date.now()}`);
    setSnackbarOpen(false)
    handleModalClose();
  };
  const handleSoldPrice = (e) => {
    
    const { name, value } = e.target;
    setExchangeDetails({
      ...exchangeDetails,
      [name]: value,
    });
    if(name==='soldPrice'){
      setExchangeDetails({ ...exchangeDetails, oldPhonePrice:value });
      setSoldPrice(value)
      
    }
   
};

  const handleSoldConfirm = async () => {
    const soldDate = formatDate(Date.now());
    const token = localStorage.getItem('token');
    const verifyToken=jwtDecode(token);
    
    const data = {
        IMEIList: selectedPhoneData.IMEIList,
        SellingPrice: soldPrice,
        CustomerName: customerName,
        CustomerCNIC: customerCNIC,
        CustomerAddress: customerAddress,
        CustomerPhoneNumber: customerPhoneNumber,
    };

    try {
        const response = await axios.post(`${baseURL}/mobile/marksold`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data.success) {
          setLoading(true);
          setSnackbarOpen(true)
          setSnackbarMessage('Phone Sold Successfully')
          

            const invoiceData = {
              date: formatDate(new Date(soldDate)),
              invoiceNo: Date.now(), 
              billTo: {
                name: customerName,
                phoneNumber: customerPhoneNumber,
                address: customerAddress,
              },
              from: {
                name: verifyToken.name,
                phoneNumber: verifyToken.phoneNumber,
                address: verifyToken.address,
              },
              items: [
                {
                  description: `${selectedPhoneData.BrandName} ${selectedPhoneData.Model} ${selectedPhoneData.Color} ${selectedPhoneData.Storage} ${selectedPhoneData.NetworkStatus}`,
                  imei: selectedPhoneData.IMEIList.join(', '),
                  price: soldPrice,
                  total: soldPrice,
                },
              ],
              exchangeItems: exchangeDetails.exchangeBrand ? [
                {
                  description: `-`,
                  imei: '-',
                  price: '-',
                  total: '-',
                },
              ] : [],
              totalAmount: soldPrice,
            };
          
            generatePDF(invoiceData, `Invoice_${Date.now()}`);
            setSnackbarOpen(false)
        } else {
            console.error('Failed to mark phone as sold:', response.data.message);
        }
    } catch (error) {
        console.error('Error making POST request:', error);
    }

    handleModalClose();
  };

  useEffect(() => {
    setExchangeDetails(prevDetails => ({
      ...prevDetails,
      IMEIList: IMEIList
    }));
  }, [IMEIList]);

  useEffect(() => {
    setExchangeDetails(prevDetails => ({
      ...prevDetails,
      Difference: selectedPhoneData.PurchasingPrice - exchangeDetails.additionalCost
    }));
  }, [exchangeDetails.exchangePrice]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  
  useEffect(() => {
    axios.get(`${baseURL}/mobile/mobile`)
      .then(response => {
        const fetchedData = response.data;
        // Transform the fetched data to match the structure of your hardcoded brandModels
        const transformedData = fetchedData.reduce((acc, item) => {
          const { brand, model, colors, storage } = item;
          // Initialize brand array if it doesn't exist
          if (!acc[brand]) {
            acc[brand] = [];
          }
          // Add model details to brand array
          acc[brand].push({
            model,
            color: colors.join(', '), // Join colors array into a string
            storage: storage.join(', ') // Join storage array into a string
          });
          return acc;
        }, {});
        setBrandModels(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);
 
  const NetworkStatusItems = [
    { key: 'Non-PTA', label: 'Non-PTA' },
    { key: 'PTA-Approved', label: 'PTA-Approved' },
    { key: 'Non-Active', label: 'Non-Active' },
    { key: 'IMEI Patched', label: 'IMEI Patched' },
    { key: 'JV', label: 'JV' },
    { key: 'CPID', label: 'CPID' },
    { key: 'Locked', label: 'Locked' },
    { key: 'Others', label: 'Others' },
  ];
  const sortedMenuItems = NetworkStatusItems.sort((a, b) => a.label.localeCompare(b.label));

  const createRows = (rows) => {


    let filteredRows = rows;
    if(filter.brand !== ''){
      filteredRows = filteredRows.filter((row) => {
        if(row.BrandName === filter.brand){
          return row;
        }
      })

      

      if(filter.model !== ''){
        filteredRows = filteredRows.filter((row) => {
          if(row.Model === filter.model){
            return row;
          }
        })
      }

    }

    if(filter.status !== ''){
      filteredRows = filteredRows.filter((row) => {
        if(row.NetworkStatus === filter.status){
          return row;
        }
      })
    }


    return filteredRows.filter(row => row.AvailablityStatus).map((row) => (
      <TableRow key={row._id}>
          <TableCell style={{ whiteSpace: 'pre-line' }}>{row.IMEIList ? row.IMEIList.join('\n') : 'N/A'}</TableCell>
          <TableCell>{row.BrandName || 'N/A'}</TableCell>
          <TableCell>{row.Model || 'N/A'}</TableCell>
          <TableCell>{row.Color || 'N/A'}</TableCell>
          <TableCell>{row.PurchasingPrice.toLocaleString() || 'N/A'}</TableCell>
          <TableCell>{row.NetworkStatus || 'N/A'}</TableCell>
          <TableCell>{row.Storage || 'N/A'}</TableCell>
          <TableCell>{row.PurchaseDate ? new Date(row.PurchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
          <TableCell>
              <IconButton onClick={() => handleModalOpen(row, setOpenInfoModal)} color="inherit">
                  <InfoIcon />
              </IconButton>
              <Button
                  style={{ marginRight: '8px' }}
                  variant="outlined"
                  startIcon={<CurrencyExchangeTwoToneIcon />}
                  onClick={() => handleModalOpen(row, setOpenExchangeModal)}
              ></Button>
              <Button
                  style={{ marginRight: '8px' }}
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleModalOpen(row, setOpenSoldModal)}
              ></Button>
          </TableCell>
      </TableRow>
    ))
  } 

  const searchingRows = () => {
    return filteredRows.filter(row => {
      for(let i = 0; i < row.IMEIList.length ; i++){
        let temp = row.IMEIList[i];
        if(temp.includes(search)){
          return row;
        }
      }
    })
  }

  const searchLastIMEIDigits = (row) => {
    for(let i = 0; i < row.IMEIList.length ; i++){
      let temp = row.IMEIList[i];
      let checkValue = temp.slice(temp.length - search.length, temp.length);
      
      if(search === checkValue){
        return row;
      }
    }
  }

  const mappingRows = () => {

    let newRows = [];

    if (search.length === 0){
      return createRows(filteredRows);
    }
    else if(search.length <= 4 && search.length > 0){
      newRows = filteredRows.filter(row => {
        return searchLastIMEIDigits(row);
      })


      if(newRows.length === 0){
        newRows = searchingRows()
      }
      
      return createRows(newRows);
      
    }
    else if(search.length > 4){
      return createRows(searchingRows());
    }
  }

  return (
    <>
    
     <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell><strong>IMEI</strong></TableCell>
                <TableCell><strong>Brand</strong></TableCell>
                <TableCell><strong>Model</strong></TableCell>
                <TableCell><strong>Color</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Network Status</strong></TableCell>
                <TableCell><strong>Storage</strong></TableCell>
                <TableCell><strong>Purchased Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {mappingRows()}
        </TableBody>
    </Table>
</TableContainer>



      {/* Sold Modal */}
      <Modal
        open={openSoldModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openSoldModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Confirm Sale
            </Typography>
            <Typography sx={{ mt: 2 }}><strong>IMEI: </strong>{selectedPhoneData.IMEIList && selectedPhoneData.IMEIList.join('\n')}</Typography>
            <Typography><strong>Brand:</strong> {selectedPhoneData.BrandName}</Typography>
            <Typography><strong>Model: </strong>{selectedPhoneData.Model}</Typography>
            <Typography><strong>Color:</strong> {selectedPhoneData.Color}</Typography>
            <Typography><strong>Network Status:</strong> {selectedPhoneData.NetworkStatus}</Typography>
            <Typography><strong>Storage:</strong> {selectedPhoneData.Storage}</Typography>
            <Typography><strong>Purchased Date:</strong> {selectedPhoneData.PurchaseDate}</Typography>
            <Typography><strong>Price: </strong>{selectedPhoneData.PurchasingPrice}</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Sold Price"
              type="number"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Customer Name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Customer CNIC"
              type="text"
              value={customerCNIC}
              onChange={(e) => setCustomerCNIC(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Customer Address"
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Customer Contact No"
              type="text"
              value={customerPhoneNumber}
              onChange={(e) => setCustomerPhoneNumber(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSoldConfirm} sx={{ mt: 2 }}>
              Confirm Sale
            </Button>
          </Box>
        </Fade>
      </Modal>

{/* Exchange Modal */}
<Modal
  open={openExchangeModal}
  onClose={handleModalClose}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{
    timeout: 500,
  }}
>
  <Fade in={openExchangeModal}>
    <Box sx={modalStyle}>
      <Box sx={contentStyle}>
        <Typography variant="h6" component="h2">
          Confirm Exchange
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>IMEI: </strong>
          {selectedPhoneData.IMEIList && selectedPhoneData.IMEIList.join('\n')}
        </Typography>
        <Typography>
          <strong>Brand:</strong> {selectedPhoneData.BrandName}
        </Typography>
        <Typography>
          <strong>Model: </strong>
          {selectedPhoneData.Model}
        </Typography>
        <Typography>
          <strong>Network Status: </strong>
          {selectedPhoneData.NetworkStatus}
        </Typography>
        <Typography>
          <strong>Storage: </strong>
          {selectedPhoneData.Storage}
        </Typography>
        <Typography>
          <strong>Color:</strong> {selectedPhoneData.Color}
        </Typography>
        <Typography>
          <strong>Price: </strong>
          {selectedPhoneData.PurchasingPrice}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" component="h2">
          Sell Device
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          name="soldPrice"
          label="Price"
          onChange={handleSoldPrice}
        />
        {
          (profitStatus?<Typography variant="h6" component="h2">
          Selling at Loss
        </Typography>:<></>)
        }
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" component="h2">
          Exchange Phone Details
        </Typography>
        <Divider />
        <FormControl fullWidth margin="normal">
          <InputLabel id="exchange-brand-label">Brand</InputLabel>
          <Select
            labelId="exchange-brand-label"
            id="exchange-brand"
            name="exchangeBrand"
            value={exchangeDetails.exchangeBrand}
            onChange={handleExchangeChange}
          >
            {Object.keys(brandModels).map((brand) => (
              <MenuItem key={brand} value={brand}>{brand}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="exchange-model-label">Model</InputLabel>
          <Select
            labelId="exchange-model-label"
            id="exchange-model"
            name="exchangeModel"
            value={exchangeDetails.exchangeModel}
            onChange={handleExchangeChange}
            disabled={!exchangeDetails.exchangeBrand}
          >
            {exchangeDetails.exchangeBrand &&
              brandModels[exchangeDetails.exchangeBrand].map((item) => (
                <MenuItem key={item.model} value={item.model}>{item.model}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="exchange-color-label">Color</InputLabel>
          <Select
            labelId="exchange-color-label"
            id="exchange-color"
            name="exchangeColor"
            value={exchangeDetails.exchangeColor}
            onChange={handleExchangeChange}
            disabled={!exchangeDetails.exchangeModel}
          >
            {exchangeDetails.exchangeModel &&
              brandModels[exchangeDetails.exchangeBrand]
                .find(item => item.model === exchangeDetails.exchangeModel)
                ?.color.split(',').map((color) => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
          </Select>
        </FormControl>
        {IMEIList.map((imei, index) => (
          <TextField
            margin="normal"
            key={index}
            fullWidth
            label={`IMEI ${index + 1}`}
            defaultValue={imei}
            variant="outlined"
            sx={{ marginBottom: '10px' }}
            onChange={(e) => handleIMEIChange(index, e.target.value)}
          />
        ))}
        <Button fullWidth variant="outlined" onClick={handleAddIMEI}>Add IMEI</Button>
        <FormControl fullWidth sx={{ mb: 2 }} margin="normal">
          <InputLabel id="exchange-network-status-label">Exchange Network Status</InputLabel>
          <Select
            labelId="exchange-network-status-label"
            name="exchangeNetworkStatus"
            value={exchangeDetails.exchangeNetworkStatus}
            onChange={handleExchangeChange}
            label="Exchange Network Status"
          >
            {NetworkStatusItems.map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>




          <FormControl fullWidth sx={{ marginBottom: '20px' }} margin="normal">
  <InputLabel id="exchange-storage-label">Exchange Storage</InputLabel>
  <Select 
  labelId="exchange-storage-label" 
  id="exchange-storage-select" 
  name="exchangeStorage"
  label="Exchange Storage" 
  value={exchangeDetails.Storage} 
  onChange={handleExchangeChange} 
  disabled={!exchangeDetails.exchangeModel} 
>
  {exchangeDetails.exchangeModel &&
    brandModels[exchangeDetails.exchangeBrand]
      ?.find(item => item.model === exchangeDetails.exchangeModel)
      ?.storage.split(',').map((storage) => (
        <MenuItem key={storage} value={storage}>{storage}</MenuItem>
      ))}
</Select>


</FormControl>







        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          name="additionalCost"
          label="Purchased Price"
      
          onChange={handleExchangeChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Difference"
          value={difference.toLocaleString()}
          disabled
        />
        <TextField
          margin="normal"
          fullWidth
          label="Exchange Date"
          name="exchangeDate"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={exchangeDetails.exchangeDate}
          onChange={(e) => handleExchangeDateChange(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Customer Name"
          type="text"
          value={exchangeDetails.CustomerName}
          onChange={(e) => handleExchangedCustomerName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Customer CNIC"
          type="text"
          value={exchangeDetails.CustomerCNIC}
          onChange={(e) => handleExchangeCNIC(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Customer Address"
          type="text"
          value={exchangeDetails.CustomerAddress}
          onChange={(e) => handleExchangeAddress(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Customer Contact No"
          type="text"
          value={exchangeDetails.CustomerPhoneNumber}
          onChange={(e) => handleExchangedCustomerPhoneNumber(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleExchangeConfirm}>
          Confirm
        </Button>
      </Box>
    </Box>
  </Fade>
</Modal>


      {/* Info Modal */}
      <Modal
        open={openInfoModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openInfoModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2" gutterBottom>
              Phone and Customer Information
            </Typography>
            {selectedPhoneData && selectedPhoneData.Customer && (
            <Typography sx={{ mt: 2 }}>
            

              <strong>IMEI:</strong> {selectedPhoneData.IMEIList?.join(', ') || 'N/A'}<br />
              <strong>Brand:</strong> {selectedPhoneData.BrandName|| 'N/A'}<br />
              <strong>Model:</strong> {selectedPhoneData.Model || 'N/A'}<br />
              <strong>Color:</strong> {selectedPhoneData.Color || 'N/A'}<br />
              <strong>Price:</strong> {selectedPhoneData.PurchasingPrice || 'N/A'}<br />
              <strong>Network Status:</strong> {selectedPhoneData.NetworkStatus || 'N/A'}<br />
              <strong>Purchased Date:</strong> {formatDate(selectedPhoneData.PurchaseDate) || 'N/A'}<br />
              <strong>Seller Name:</strong> {selectedPhoneData.Customer.Name || 'N/A'}<br />
              <strong>Seller CNIC:</strong> {selectedPhoneData.Customer.CNIC || 'N/A'}<br />
              <strong>Seller Address:</strong> {selectedPhoneData.Customer.Address || 'N/A'}<br />
              <strong>Seller Phone Number:</strong> {selectedPhoneData.Customer.PhoneNumber || 'N/A'}<br /> 
            
              </Typography>
              )}
          </Box>
        </Fade>
      </Modal>
     <Snackbar
open={snackbarOpen}
autoHideDuration={6000}
message={snackbarMessage}
/>
    </>
  );
}
