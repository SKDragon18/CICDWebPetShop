import React, { useState } from 'react';
import { TextField, Select, InputLabel, FormControl,MenuItem  } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import './Filter.css'
const Filter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [breed, setBreed] = useState('all');
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleBreedChange = (event) => {
      setBreed(event.target.value);
    };
  
    const filteredPets = () => {
      return pets.filter((pet) => {
        const nameMatch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
        const breedMatch = breed === 'all' || pet.breed === breed;
        return nameMatch && breedMatch;
      });
    };
  
    return (
      <div className="filter">
        <TextField
            className="find-field"
          id="search-field"
          label="Tìm kiếm thú cưng"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),}}
        />
        <div className="filter-giong">
            <InputLabel id="breed-label">Giống</InputLabel>
            <FormControl>
            <Select
                value={breed}
                labelId="breed-label"
                onChange={handleBreedChange}
            >
                <MenuItem value="all">Tất cả</MenuItem>
                {/* Options cho các giống khác */}
            </Select>
            </FormControl>
        </div>
      </div>
    );
  };
  
  export default Filter;