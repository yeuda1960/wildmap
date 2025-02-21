import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
  Divider
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../config/api';

const getRiskLevelPriority = (riskLevel) => {
  const level = riskLevel.toLowerCase();
  if (level === 'critically endangered') return 1;
  if (level === 'endangered') return 2;
  if (level === 'vulnerable') return 3;
  if (level === 'near threatened') return 4;
  if (level === 'least concern') return 5;
  return 6; // For any other status like 'Not Evaluated'
};

const AnimalList = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(ENDPOINTS.ANIMALS.LIST);
        
        if (response.data && response.data.items) {
          // Sort animals by risk level and name before setting state
          const sortedAnimals = response.data.items.sort((a, b) => {
            const riskComparison = getRiskLevelPriority(a.risk_level) - getRiskLevelPriority(b.risk_level);
            if (riskComparison === 0) {
              return a.name.localeCompare(b.name);
            }
            return riskComparison;
          });
          
          setAnimals(sortedAnimals);
          setFilteredAnimals(sortedAnimals);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching animals:', err);
        setError('Failed to load animals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Filter animals when search term or risk level changes
  useEffect(() => {
    let filtered = animals;
    
    if (searchTerm) {
      filtered = filtered.filter(animal => 
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (riskLevel) {
      filtered = filtered.filter(animal => 
        animal.risk_level.toLowerCase() === riskLevel.toLowerCase()
      );
    }
    
    // Sort filtered results by risk level and name
    filtered = filtered.sort((a, b) => {
      const riskComparison = getRiskLevelPriority(a.risk_level) - getRiskLevelPriority(b.risk_level);
      if (riskComparison === 0) {
        return a.name.localeCompare(b.name);
      }
      return riskComparison;
    });
    
    setFilteredAnimals(filtered);
  }, [searchTerm, riskLevel, animals]);

  const getRiskLevelColor = (level) => {
    const levelLower = level.toLowerCase();
    if (levelLower === 'critically endangered') return 'error';
    if (levelLower === 'endangered') return 'error';
    if (levelLower === 'vulnerable') return 'warning';
    if (levelLower === 'least concern') return 'success';
    return 'default';
  };

  // Group animals by risk level
  const groupedAnimals = filteredAnimals.reduce((groups, animal) => {
    const riskLevel = animal.risk_level;
    if (!groups[riskLevel]) {
      groups[riskLevel] = [];
    }
    groups[riskLevel].push(animal);
    return groups;
  }, {});

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wildlife Database
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Animals"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskLevel}
                label="Risk Level"
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <MenuItem value=""><Typography>All</Typography></MenuItem>
                <MenuItem value="Critically Endangered"><Typography fontWeight="bold">Critically Endangered</Typography></MenuItem>
                <MenuItem value="Endangered"><Typography fontWeight="bold">Endangered</Typography></MenuItem>
                <MenuItem value="Vulnerable"><Typography fontWeight="bold">Vulnerable</Typography></MenuItem>
                <MenuItem value="Least Concern"><Typography fontWeight="bold">Least Concern</Typography></MenuItem>
                <MenuItem value="Not Evaluated"><Typography fontWeight="bold">Not Evaluated</Typography></MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {Object.entries(groupedAnimals).map(([riskLevel, animals], index) => (
        <Box key={riskLevel} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, mt: index > 0 ? 4 : 0, fontWeight: 'bold' }}
          >
            {riskLevel}
          </Typography>
          <Grid container spacing={3}>
            {animals.map((animal) => (
              <Grid item xs={12} sm={6} md={4} key={animal.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                  onClick={() => navigate(`/animals/${animal.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(animal.image_url)}
                    alt={animal.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      {animal.name}
                    </Typography>
                    {animal.scientific_name && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', mb: 1 }}
                      >
                        {animal.scientific_name}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={animal.risk_level}
                        size="small"
                        color={getRiskLevelColor(animal.risk_level)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {filteredAnimals.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No animals found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AnimalList; 