import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  Science as ScienceIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  Terrain as TerrainIcon
} from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../config/api';

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        console.log('Fetching animal with ID:', id);
        const response = await axios.get(ENDPOINTS.ANIMALS.DETAIL(id));
        console.log('Animal details response:', response.data);
        
        if (response.data.error) {
          setError(response.data.error);
          setAnimal(null);
        } else {
          setAnimal(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching animal details:', err);
        setError(err.response?.data?.error || 'Failed to load animal details. Please try again later.');
        setAnimal(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimal();
    }
  }, [id]);

  const getRiskLevelColor = (level) => {
    if (!level) return 'default';
    const levelLower = level.toLowerCase();
    if (levelLower.includes('critically endangered')) return 'error';
    if (levelLower.includes('endangered')) return 'error';
    if (levelLower.includes('vulnerable')) return 'warning';
    if (levelLower.includes('least concern')) return 'success';
    return 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!animal) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>Animal not found.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : animal ? (
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            {animal.image_url ? (
              <Box
                component="img"
                src={getImageUrl(animal.image_url)}
                alt={animal.name}
                sx={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No image available
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {animal.name}
              </Typography>
              {animal.scientific_name && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', mb: 2 }}
                >
                  {animal.scientific_name}
                </Typography>
              )}
              <Chip
                label={animal.risk_level}
                color={getRiskLevelColor(animal.risk_level)}
                icon={<WarningIcon />}
                sx={{ mb: 3 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Type"
                  secondary={animal.type || 'Not specified'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Region"
                  secondary={animal.region || 'Not specified'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <TerrainIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Habitat"
                  secondary={animal.habitat || 'Not specified'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Description"
                  secondary={animal.description || 'No description available'}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
};

export default AnimalDetail; 