import React, { useState } from "react";
import NavBar from "../Components/Appbar";
import SectionContainer from "../Components/SectionContainer";
import PhoneInventoryTable from "../Components/PhoneInventoryTable";
import TextField from '@mui/material/TextField';



export default function AvailableStock() {
  const [filter, setFilter] = useState({ brand: '', model: '', status: '' });
  const [search, setSearch] = useState('');
  

  return (
    <>
      <NavBar />
      <div className="sectionContainerStyle" style={{ margin: '20px', padding: '5px' }}>
        <SectionContainer
          title={'Available Stocks'}
          showFilter={true}
          filter={filter}
          onFilterChange={setFilter}
        />
        <TextField id="outlined-basic" label="Search By IMEI" variant="outlined" sx={{width: '100%'}} value={search} onChange={(e) => {setSearch(e.target.value)}} />
      </div>
      <div className="tablesection" style={{ margin: '20px', padding: '10px' }}>
        <PhoneInventoryTable filter={filter} setFilter={setFilter} search={search} />
      </div>
    </>
  );
}
