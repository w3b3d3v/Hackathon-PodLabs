import React from 'react';
import {
  Container,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

const FilterPanel = () => {
  const [sortBy, setSortBy] = React.useState('');

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container>
    <Box
      mt={4}
      mb={4}
      bgcolor="white"
      p={2}
      boxShadow={1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height={80}
    >
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="h2" mr={2}>
          Filter By:
        </Typography>
        <FormControlLabel control={<Switch />} label="Ativos" />
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="h2" mr={2}>
          Sort By:
        </Typography>
        <FormControl>
          <InputLabel id="sort-by-label">Sort</InputLabel>
          <Select
            labelId="sort-by-label"
            value="recent"
            label="Sort"
            onChange={handleSortByChange}
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
    </Container>
  );
};

export default FilterPanel;
