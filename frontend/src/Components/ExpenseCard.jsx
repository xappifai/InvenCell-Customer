import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ExpenseCard = ({ title, expenses, total}) => {



  return (
    <Card style={{height: '250px' ,display: 'flex', flexDirection: 'column', justifyContent: 'space-between', aspectRatio: '1 / 1' ,margin:'8px', width:'100%'}} sx={{ boxShadow: 3, padding: '20px' }}>
      <CardContent >
        <Typography variant="h5" component="div" sx={{fontWeight: 'bolder', my:'20px'}}>
          {title}
        </Typography>
        {expenses.map((expense) => (
          <Typography key={expense._id} variant="body2" sx={{paddingY:'4px'}}>
            {expense.date ? `${expense.date}: ` : ''}{expense.description}: Rs.{expense.amount.toFixed(2)}
          </Typography>
        ))}
        
          <Typography variant="body1" component="div" style={{ fontWeight: 'bold', textAlign: 'right' }}>
            Total: Rs.{total}
          </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
