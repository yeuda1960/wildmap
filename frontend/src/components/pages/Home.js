import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to WildMap
        </Typography>
        <Typography variant="body1">
          A GIS-based system for mapping and tracking wildlife in different geographic regions.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 