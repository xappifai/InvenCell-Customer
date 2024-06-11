import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactSearchBox from 'react-search-box';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../Styles/style.css';
import baseurl from '../Assets/baseurl';

export default function SectionContainer(props) {
  const { title, showFilter, showSearch, filter, onFilterChange } = props;
  const [brandModels, setBrandModels] = useState({});
  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    onFilterChange({ ...filter, brand: selectedBrand,model:'',status:'' });
  };
  
  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    onFilterChange({ ...filter, model: selectedModel });
  };
  
  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    onFilterChange({ ...filter, status: selectedStatus });
  };
  
  useEffect(() => {
    
  }, [filter]);
  
  // Models for each brand
  useEffect(() => {
    axios.get(`${baseurl}:7018/api/mobile/`)
      .then(response => {
        const fetchedData = response.data;
        // Transform the fetched data to only include brand and model
        const transformedData = fetchedData.reduce((acc, item) => {
          const { brand, model } = item;
          // Initialize brand array if it doesn't exist
          if (!acc[brand]) {
            acc[brand] = [];
          }
          // Add model to brand array
          acc[brand].push(model);
          return acc;
        }, {});
        setBrandModels(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);
  

  // Define the data for ReactSearchBox
  const data = [
    // { key: 'john', value: 'John Doe' },
    // { key: 'jane', value: 'Jane Doe' },
    // { key: 'mary', value: 'Mary Phillips' },
    // { key: 'robert', value: 'Robert' },
    // { key: 'karius', value: 'Karius' },
  ];

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

  return (
    <>
      <div className="section-container">
        <h1>{title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {showFilter && (
            <Box sx={{ minWidth: 120, marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel id="brand-label">Brand</InputLabel>
                <Select
                  labelId="brand-label"
                  id="brand-select"
                  value={filter.brand}
                  label="Brand"
                  onChange={handleBrandChange}
                >
                  <MenuItem value={''}>All</MenuItem>
                  {Object.keys(brandModels).map((brandName) => (
                    <MenuItem key={brandName} value={brandName}>
                      {brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {showFilter && filter.brand && (
            <Box sx={{ minWidth: 120, marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel id="model-label">Model</InputLabel>
                <Select
                  labelId="model-label"
                  id="model-select"
                  value={filter.model}
                  label="Model"
                  onChange={handleModelChange}
                >
                  <MenuItem value={''}>All</MenuItem>
                  {brandModels[filter.brand].map((modelName) => (
                    <MenuItem key={modelName} value={modelName}>
                      {modelName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {showFilter && (
            <Box sx={{ minWidth: 120, marginRight: '10px' }}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status-select"
                  value={filter.status}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value={''}>All</MenuItem>
                  {NetworkStatusItems.map(item => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </div>
      </div>

      {showSearch && (
        <ReactSearchBox
          className="section-container2"
          placeholder="Search By IMEI"
          value=""
          data={data}
        />
      )}
    </>
  );
}

SectionContainer.propTypes = {
  title: PropTypes.string.isRequired,
  showFilter: PropTypes.bool.isRequired,
  showSearch: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
