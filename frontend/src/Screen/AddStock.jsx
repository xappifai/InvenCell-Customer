import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import NavBar from '../Components/Appbar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Typography, Select, MenuItem, InputLabel, FormControl, Grid, Divider, Snackbar } from '@mui/material';
import DatePicker from 'rsuite/DatePicker';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import 'rsuite/DatePicker/styles/index.css';
import baseURL from '../Assets/baseurl';



export default function AddStock() {
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [CustomerName, setCustomerName] = useState('');
  const [CustomerCNIC, setCustomerCNIC] = useState('');
  const [CustomerAddress, setCustomerAddress] = useState('');
  const [CustomerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [BrandName, setBrand] = useState('');
  const [IMEIList, setIMEIList] = useState(['']);
  const [Model, setModel] = useState('');
  const [Color, setColor] = useState('');
  const [NetworkStatus, setNetworkStatus] = useState('');
  const [Storage, setStorage] = useState('');
  const [Price, setPrice] = useState('');
  const [brandModels, setBrandModels] = useState({});
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const [snackbarMessage, setSnackbarMessage] = useState('');
  

  useEffect(() => {
    axios.get(`${baseURL}/mobile/mobile`)
      .then(response => {
        const fetchedData = response.data;
        const transformedData = fetchedData.reduce((acc, item) => {
          const { brand, model, colors = [], storage = [] } = item;
          if (!acc[brand]) {
            acc[brand] = [];
          }
          acc[brand].push({
            model,
            colors,
            storage,
          });
          return acc;
        }, {});
        setBrandModels(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handlePassword = (e) => {
    e.preventDefault();
    const uniqueIdentifier = "123456";
    if (password === uniqueIdentifier) {
      setShowForm(true);
    }
  };

  const handleAddIMEI = () => {
    setIMEIList([...IMEIList, '']);
  };

  const handleIMEIChange = (index, value) => {
    const updatedIMEIList = [...IMEIList];
    updatedIMEIList[index] = value;
    setIMEIList(updatedIMEIList);
  };

  const handleSubmitButton = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const verifyToken = jwtDecode(token);
    const requestBody = {
      Email: verifyToken.email,
      CNIC: verifyToken.cnic,
      BrandName: BrandName,
      Color: Color,
      Model: Model,
      PurchasingPrice: Price,
      NetworkStatus: NetworkStatus,
      Storage: Storage,
      IMEIList: IMEIList,
      PurchaseDate: selectedDate,
      CustomerName: CustomerName,
      CustomerCNIC: CustomerCNIC,
      CustomerAddress: CustomerAddress,
      CustomerPhoneNumber: CustomerPhoneNumber,
      PurchaserName: verifyToken.name,
      PurchaserCNIC: verifyToken.cnic,
      PurchaserAddress: verifyToken.address,
      PurchaserPhoneNumber: verifyToken.phoneNumber,
    };

    try {
      const response = await fetch(`${baseURL}/mobile/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Data added successfully:');
        // Clear the form after successfully adding the item
        setBrand('');
        setSelectedModel('');
        setColor('');
        setStorage('');
        setNetworkStatus('');
        setIMEIList(['']);
        setPrice('');
        setSelectedDate('');
        setCustomerName('');
        setCustomerCNIC('');
        setCustomerAddress('');
        setCustomerPhoneNumber('');
        openSnackbar('success', 'Phone added successfully');
      } else {
        console.error('Failed to add data:', response.statusText);
        openSnackbar('error', 'Failed to add phone');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setBrand(selectedBrand);
    setModel('');
    setColor('');
    setSelectedModel('');
  };

  const handleNetworkStatus = (event) => {
    const networkstatus = event.target.value;
    setNetworkStatus(networkstatus);
  };

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    setModel(selectedModel);
    setSelectedModel(selectedModel);
  };

  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    setColor(selectedColor);
  };

  const handlePriceChange = (event) => {
    const price = event.target.value;
    setPrice(price);
  };

  const handleStorageChange = (event) => {
    const storage = event.target.value;
    setStorage(storage);
  };

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

  return (
    <>
      <NavBar />
      <Box sx={{ maxWidth: '600px', margin: 'auto', padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '20px' }}>Add New Stock</Typography>
        {!showForm ? (
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Password" type='password' variant="outlined" onChange={(e) => setPassword(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained" onClick={handlePassword}>Submit</Button>
            </Grid>
          </Grid>
        ) : (
          <>
            <section>
              <Typography variant="h6" sx={{ marginBottom: '10px' }}>Product Details</Typography>
              <Divider sx={{ marginBottom: '20px' }} />
              <FormControl fullWidth>
                <InputLabel id="brand-label">Brand</InputLabel>
                <Select 
                  labelId="brand-label" 
                  id="brand-select" 
                  value={BrandName} 
                  label="Brand" 
                  onChange={handleBrandChange} 
                  sx={{ marginBottom: '10px' }}
                >
                  {Object.keys(brandModels).map((brandName) => (
                    <MenuItem key={brandName} value={brandName}>{brandName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="model-label">Model</InputLabel>
                <Select 
                  labelId="model-label" 
                  id="model-select" 
                  value={Model} 
                  label="Model" 
                  onChange={handleModelChange} 
                  sx={{ marginBottom: '10px' }}
                >
                  {brandModels[BrandName] && brandModels[BrandName].map(({ model }) => (
                    <MenuItem key={model} value={model}>{model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                <InputLabel id="color-label">Color</InputLabel>
                <Select 
                  labelId="color-label" 
                  id="color-select" 
                  label="Color" 
                  value={Color} 
                  onChange={handleColorChange} 
                >
                  {brandModels[BrandName]?.filter(({ model }) => model === selectedModel)
                    .flatMap(({ colors }) => colors).map(color => (
                      <MenuItem key={color} value={color}>{color}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                <InputLabel id="storage-label">Storage</InputLabel>
                <Select 
                  labelId="storage-label" 
                  id="storage-select" 
                  label="Storage" 
                  value={Storage} 
                  onChange={handleStorageChange} 
                >
                  {brandModels[BrandName]?.filter(({ model }) => model === selectedModel)
                    .flatMap(({ storage }) => storage).map(storage => (
                      <MenuItem key={storage} value={storage}>{storage}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="networkstatus-label">Network Status</InputLabel>
                <Select 
                  labelId="networkstatus-label" 
                  id="networkstatus-select" 
                  value={NetworkStatus} 
                  label="Network Status" 
                  onChange={handleNetworkStatus} 
                  sx={{ marginBottom: '10px' }}
                >
                  {sortedMenuItems.map(item => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {IMEIList.map((imei, index) => (
                <TextField 
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
              <TextField fullWidth label="Price" type="number" variant="outlined" value={Price} onChange={handlePriceChange} sx={{ marginBottom: '10px', marginTop: '10px' }} />
              <DatePicker label={'Purchasing Date:  '} value={selectedDate} onChange={handleDateChange} format="dd.MM.yyyy" oneTap style={{ width: 'auto' }} />
            </section>
            <section>
              <Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>Seller Information</Typography>
              <Divider sx={{ marginBottom: '20px' }} />
              <TextField fullWidth label="Seller Name" variant="outlined" sx={{ marginBottom: '10px' }} onChange={(e) => setCustomerName(e.target.value)} />
              <TextField fullWidth label="Seller CNIC " variant="outlined" sx={{ marginBottom: '10px' }} onChange={(e) => setCustomerCNIC(e.target.value)} />
              <TextField fullWidth label="Seller Contact No " variant="outlined" sx={{ marginBottom: '10px' }} onChange={(e) => setCustomerPhoneNumber(e.target.value)} />
              <TextField fullWidth label="Seller Address" variant="outlined" sx={{ marginBottom: '20px' }} onChange={(e) => setCustomerAddress(e.target.value)} />
            </section>
            <Button fullWidth variant="contained" sx={{ marginTop: '20px' }} onClick={handleSubmitButton}>Add Item to Stock</Button>
          </>
        )}
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
