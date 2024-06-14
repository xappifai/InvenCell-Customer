import React, { useEffect, useState } from 'react';
import NavBar from '../Components/Appbar';
import { Grid, Button, Modal, Backdrop, Fade, Box, Typography, TextField} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ExpenseCard from '../Components/ExpenseCard';
import baseURL from '../Assets/baseurl';

export default function Expense() {

  const [data, setData] = useState({today: [], weekly: [], monthly: []});
  const [filter, setFilter] = React.useState('today');
  const [render, setRender] = useState(0);
  const [totals, setTotals] = useState({today: 0, weekly: 0, monthly: 0})

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState('');

    // New state variables for update modal
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [updateAmount, setUpdateAmount] = useState(0);
    const [updateDesc, setUpdateDesc] = useState('');



  useEffect(() => {
    fetchData()
    fetchTotals()
  },[render])

  const fetchData = async () => {
    const token = localStorage.getItem('token');

    let today = [];
    let weekly = [];
    let monthly = [];

    try{
      const todayResponse = await axios.get(`${baseURL}:5629/expense/getlisttodayExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      })

      today = todayResponse.data;
    }
    catch(e){
      console.log('theres an error in listing today expense');
    }
    
    try{
      const weeklyResponse = await axios.get(`${baseURL}:5629/expense/getlistWeeklyExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      })
      
      weekly = weeklyResponse.data;
    }
    catch(e){
      console.log('theres an error in listing weekly expense');
    }
    try{
      const monthlyResponse = await axios.get(`${baseURL}:5629/expense/getlistMonthlyExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      })

      monthly = monthlyResponse.data;
    }
    catch(e){
      console.log('theres an error in listing monthly expense');
    }
  
      setData({
        today: today,
        weekly: weekly,
        monthly: monthly
      });
    

  }

  const fetchTotals = async () => {
    const token = localStorage.getItem('token');

    let  today = 0;
    let  weekly = 0;
    let  monthly = 0;

    try{
      const todayTotal = await axios.get(`${baseURL}:5629/expense/getTodayExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      })

      today = todayTotal.data.total;
    }
    catch(e){
      console.log('theres an error in today expense');
    }

    try{
      const weeklyTotal = await axios.get(`${baseURL}:5629/expense/getWeeklyExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      })

      weekly = weeklyTotal.data.total;
    }
    catch(e){
      console.log("theres an error in weekly expense");
    }
      
    try{
      const monthlyTotal = await axios.get(`${baseURL}:5629/expense/getMonthlyExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      })

      monthly = monthlyTotal.data.total;
    }
    catch(e){
      console.log("there is an error in  monthly total");
    }
  
      const totals = {today: today, weekly: weekly, monthly: monthly}
  
      setTotals(totals);
    
  }

  const AddExpense = async (amount, description) => {
    const token = localStorage.getItem('token');

    if(description !== '' && amount > 0){
      const response = await axios.post(`${baseURL}:5629/expense/add`, {amount: amount, description: description}, {
        headers: {
          authorization: `token ${token}` 
        }
      })
  
      
  
      
    
      setAmount();
      setDesc('');
      setRender(render+1);
    }

  }
  const DeleteExpense = async (id) => {
    const token = localStorage.getItem('token');

    const response = await axios.delete(`${baseURL}:5629/expense/delete/${id}`, {
      headers: {
        authorization: `token ${token}` 
      }
    })

    
    
   
    setRender(render+1);
  }

    // Update expense function
    const updateExpense = async () => {
      const token = localStorage.getItem('token');

      if(updateDesc !== '' && updateAmount > 0){
        const response = await axios.put(`${baseURL}:5629/expense/update/${updateId}`, {amount: updateAmount, description: updateDesc} ,{
          headers: {
            authorization: `token ${token}` 
          }
        })
  
        
        setRender(render+1);
      }

    };

    

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddExpense = () => {
    AddExpense(amount, desc);
    handleClose();
  }
  

  const handleChange = (event) => {
    setFilter(event.target.value);
  };


  const handleOpenUpdateModal = (id, amount, desc) => {
    setUpdateId(id);
    setUpdateAmount(amount);
    setUpdateDesc(desc);
    setOpenUpdateModal(true);
  };

  // Handle close update modal
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  // Handle update expense
  const handleUpdateExpense = () => {
    updateExpense();
    handleCloseUpdateModal();
  };

  const calculateTotal = () => {
    if(filter === 'weekly'){
      return totals.weekly;
    }
    else if(filter === 'monthly'){
      return totals.monthly;
    }
    return totals.today;

  }
  const showDataInTable = () => {
    const temp = (arr) => {
      return arr.map((val, index) => (
        <TableRow
          key={val.name}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="val">
            {index+1}
          </TableCell>
          <TableCell align="left">{val.description}</TableCell>
          <TableCell align="left">Rs.{val.amount}</TableCell>
          <TableCell align="left">{new Date(val.timestamp).toDateString()}</TableCell>
          <TableCell align="left">
            <Button variant="contained" color="success" startIcon={<SyncAltIcon />} sx={{mr:'5px'}} onClick={() => {handleOpenUpdateModal(val._id, val.amount, val.description)}}>
              Update
            </Button>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => {DeleteExpense(val._id)}}>
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))
    }

    if(filter === 'weekly'){
      return temp(data.weekly);
    }
    else if(filter === 'monthly'){
      return temp(data.monthly);
    }
    return temp(data.today);

  }

  return (
    <>
      <NavBar />
      
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0px'}}>
        <div style={{width: '80%'}}>
        <h1>My Expenses</h1>
        <Box
          width={'100%'}
          mt={8}
          mb={4}
          display="flex"
          alignItems="center"
          gap={8}
        >
          <ExpenseCard expenses={data.today.slice(0, 5)} title={'Today\'s Expenses'} total={totals.today} />
          <ExpenseCard expenses={data.weekly.slice(0, 5)} title={'Weekly Expenses'} total={totals.weekly} />
          <ExpenseCard expenses={data.monthly.slice(0, 5)} title={'Monthly Expenses'} total={totals.monthly} />
        </Box>

          <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleOpen} style={{margin:'14px 0px'}}>
                Add Today Expense
              </Button>
            </Grid>

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="filter-label">Filter</InputLabel>
                <Select
                  labelId="filter-label"
                  id="filter"
                  value={filter}
                  label="Filter"
                  onChange={handleChange}
                >
                  <MenuItem value={'today'}>Today</MenuItem>
                  <MenuItem value={'weekly'}>Weekly</MenuItem>
                  <MenuItem value={'monthly'}>Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <Box>
            <p style={{fontWeight:'bold'}}>Total {filter} expense: Rs. {calculateTotal()}</p>
          </Box>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell><span style={{fontWeight: 'bold'}}>Serial Number</span> </TableCell>
                    <TableCell align="left"><span style={{fontWeight: 'bold'}}>Expense Name</span> </TableCell>
                    <TableCell align="left"><span style={{fontWeight: 'bold'}}>Price </span></TableCell>
                    <TableCell align="left"><span style={{fontWeight: 'bold'}}>Date </span></TableCell>
                    <TableCell align="left"><span style={{fontWeight: 'bold'}}>Actions </span></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showDataInTable()}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </div>
      <Modal
      
        open={open}
        onClose={handleClose}
        aria-labelledby="expense-modal-title"
        aria-describedby="expense-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" gutterBottom>Add Today's Expense</Typography>
            
              <div style={{ display: 'flex', marginBottom: '10px'}} >
                <TextField
                  label="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  fullWidth
                  placeholder='Expenditure Name'
                  margin="dense"
                  style={{marginRight:'10px'}}
                />
                <TextField
                  label="Amount"
                  value={amount}
                  type='number'
                  placeholder='Amount Rs'
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  margin="dense"
                />
              </div>
            <Button variant="contained" color="primary" onClick={handleAddExpense} style={{ marginTop: '10px' }}>
              Add Expense
            </Button>
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="update-expense-modal-title"
        aria-describedby="update-expense-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openUpdateModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Expense
            </Typography>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <TextField
                label="Description"
                value={updateDesc}
                onChange={(e) => setUpdateDesc(e.target.value)}
                fullWidth
                margin="dense"
                style={{ marginRight: '10px' }}
              />
              <TextField
                label="Amount"
                value={updateAmount}
                type="number"
                onChange={(e) => setUpdateAmount(e.target.value)}
                fullWidth
                margin="dense"
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateExpense}
              style={{ marginTop: '10px' }}
            >
              Update
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
