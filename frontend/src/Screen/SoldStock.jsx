import React, { useState } from 'react';
import NavBar from '../Components/Appbar';
import SectionContainer from '../Components/SectionContainer';
import SoldInventoryTable from '../Components/SoldInventoryTable';
import TextField from '@mui/material/TextField';

export default function SoldStock() {
  const [filter, setFilter] = useState({ brand: '', model: '', status: '' });
  const [search, setSearch] = useState('');

  return (
    <>
      <NavBar />
      <div className="sectionContainerStyle" style={{ margin: '20px', padding: '5px' }}>
        <SectionContainer
          title={'Sold Stocks'}
          showFilter={true}
          filter={filter}
          onFilterChange={setFilter}
        />
        <TextField id="outlined-basic" label="Search By IMEI" variant="outlined" sx={{width: '100%'}} value={search} onChange={(e) => {setSearch(e.target.value)}} />
      </div>
      <div className="tablesection" style={{ margin: '20px', padding: '10px' }}>
        <SoldInventoryTable filter={filter} setFilter={setFilter} search={search} />
      </div>
    </>
  );
}
