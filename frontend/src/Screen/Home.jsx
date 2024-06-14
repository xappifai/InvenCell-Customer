import React, { useState,useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import NavBar from "../Components/Appbar";
import SectionContainer from '../Components/SectionContainer';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../Assets/baseurl';


export default function UserGainChart() {

  // Initialize the filter object with an empty brand property
  const [filter, setFilter] = useState({ brand: '', model: '', status: '' });

  const [data, setData] = useState({
    todayTotalExpense: 0,
    weeklyTotalExpense: 0,
    monthlyTotalExpense: 0,
    todayTotalGain: 0,
    weeklyTotalGain: 0,
    monthlyTotalGain: 0});

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');

    let todayPurchaseValue = 0; 
    let weeklyPurchaseValue = 0; 
    let monthlyPurchaseValue = 0; 

    let todayExpenseValue = 0; 
    let weeklyExpenseValue = 0; 
    let monthlyExpenseValue = 0; 

    let todayGainValue = 0; 
    let weeklyGainValue = 0; 
    let monthlyGainValue = 0; 

    try {
      const todayPurchase = await axios.get(`${baseURL}:5629/mobile/getTodayPurchasing`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      todayPurchaseValue = todayPurchase.data.total;
    } catch (error) {
      console.error("Error getting today's purchasing:");
    }

    try {
      const weeklyPurchase = await axios.get(`${baseURL}:5629/mobile/getWeeklyPurchasing`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      weeklyPurchaseValue = weeklyPurchase.data.total;
    } catch (error) {
      console.error("Error getting weekly purchasing:", error);
    }

    try {
      const monthlyPurchase = await axios.get(`${baseURL}:5629/mobile/getMonthlyPurchasing`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      monthlyPurchaseValue = monthlyPurchase.data.total;
    } catch (error) {
      console.error("Error getting monthly purchasing:", error);
    }

    try {
      const todaySold = await axios.get(`${baseURL}:5629/mobile/getTodaySelling`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      todayGainValue = todaySold.data.total;
    } catch (error) {
      console.error("Error getting today's selling:", error);
    }

    try {
      const weeklySold = await axios.get(`${baseURL}:5629/mobile/getWeeklySelling`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      weeklyGainValue = weeklySold.data.total;
    } catch (error) {
      console.error("Error getting weekly selling:", error);
    }

    try {
      const monthlySold = await axios.get(`${baseURL}:5629/mobile/getMonthlySelling`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      monthlyGainValue = monthlySold.data.total;
    } catch (error) {
      console.error("Error getting monthly selling:", error);
    }

    try {
      const todayExpense = await axios.get(`${baseURL}:5629/expense/getTodayExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      todayExpenseValue = todayExpense.data.total;
    } catch (error) {
      console.error("Error getting today's expense:", error);
    }

    try {
      const weeklyExpense = await axios.get(`${baseURL}:5629/expense/getWeeklyExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      weeklyExpenseValue = weeklyExpense.data.total;
    } catch (error) {
      console.error("Error getting weekly expense:", error);
    }

    try {
      const monthlyExpense = await axios.get(`${baseURL}:5629/expense/getMonthlyExpense`, {
        headers: {
          authorization: `token ${token}` 
        }
      });
      monthlyExpenseValue = monthlyExpense.data.total;
    } catch (error) {
      console.error("Error getting monthly expense:", error);
    }


    const todayTotalExpense = todayExpenseValue + todayPurchaseValue;
    const weeklyTotalExpense = weeklyExpenseValue + weeklyPurchaseValue;
    const monthlyTotalExpense = monthlyExpenseValue + monthlyPurchaseValue;


    const obj = {
      todayTotalExpense: todayTotalExpense,
      weeklyTotalExpense: weeklyTotalExpense,
      monthlyTotalExpense: monthlyTotalExpense,
      todayTotalGain: todayGainValue,
      weeklyTotalGain: weeklyGainValue,
      monthlyTotalGain: monthlyGainValue,  
    }

    setData(obj);
  }

  return (
    <>
      <NavBar />
      <div className="sectionContainerStyle" style={{margin:'20px',padding:'5px'}}>
        {/* Pass the filter object with the brand property defined */}
        <SectionContainer
          title={'Available Stocks'}
          showFilter={false}
          showSearch={false}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Grid container spacing={3} gap={3} justifyContent="center">
              <Card style={{  padding:'16px'}}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: ['Financials'] }]}
                      series={[
                        { data: [data.todayTotalExpense], color: 'red', label: 'Invested' },
                        { data: [data.todayTotalGain], color: 'green', label: 'Profit' },
                      ]}
                      width={300}
                      height={300}
                    />
                  <Typography variant="h9" component="div" style={{ marginTop: '1rem' }}>
                  Total Profit: {(parseFloat(data.todayTotalGain) - parseFloat(data.todayTotalExpense) ).toLocaleString()}
                  </Typography>
                  <Typography variant="h9" component="div" style={{ marginTop: '1rem' }}>
                  In hand Cash: {(parseFloat(data.todayTotalGain)).toLocaleString()}
                  </Typography>

                  <Typography variant="h5" component="div" style={{ marginTop: '4rem' }}>Daily</Typography>
                </CardContent>
              </Card>
              <Card style={{  padding:'16px'}}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: ['Financials'] }]}
                      series={[
                        { data: [data.weeklyTotalExpense], color: 'red', label: 'Invested' },
                        { data: [data.weeklyTotalGain], color: 'green', label: 'Profit' },
                      ]}
                      width={300}
                      height={300}
                    />
                    <Typography variant="h9" component="div" style={{ marginTop: '1rem' }}>
                  Total Profit: {(parseFloat(data.weeklyTotalGain) - parseFloat(data.weeklyTotalExpense) ).toLocaleString()}
                  </Typography>
                  <Typography variant="h9" component="div" style={{ marginTop: '1rem' }}>
                  In hand Cash: {(parseFloat(data.weeklyTotalGain)).toLocaleString()}
                  </Typography>
                  <Typography variant="h5" component="div" style={{ marginTop: '4rem' }}>Weekly</Typography>
                </CardContent>
              </Card>
              <Card style={{padding:'16px'}}>
                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: ['Financials'] }]}
                      series={[
                        { data: [data.monthlyTotalExpense], color: 'red', label: 'Invested' },
                        { data: [data.monthlyTotalGain], color: 'green', label: 'Profit' },
                      ]}
                      width={300}
                      height={300}
                    />
                      <Typography variant="h9" component="div" style={{ marginTop: '1rem' }}>
                  Total Profit: {(parseFloat(data.monthlyTotalGain) - parseFloat(data.monthlyTotalExpense) ).toLocaleString()}
                  </Typography>
                  <Typography variant="h9" component="div" style={{ marginTop: '1rem' }}>
                  In hand Cash: {(parseFloat(data.monthlyTotalGain)).toLocaleString()}
                  </Typography>
                    <Typography variant="h5" component="div" style={{ marginTop: '4rem' }}>Monthly</Typography>
                </CardContent>
              </Card>
        </Grid>
      </Container>
      <ToastContainer />
    </>
  );
}
