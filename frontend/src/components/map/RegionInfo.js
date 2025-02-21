import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { Close as CloseIcon, Pets as PetsIcon } from '@mui/icons-material';
import { getImageUrl } from '../../config/api';

const getRiskLevelPriority = (riskLevel) => {
  const level = riskLevel.toLowerCase();
  if (level.includes('critically endangered')) return 1;
  if (level.includes('endangered')) return 2;
  if (level.includes('vulnerable')) return 3;
  if (level.includes('near threatened')) return 4;
  if (level.includes('least concern')) return 5;
  return 6; // For any other status like 'Not Evaluated'
};

const RegionInfo = ({ region, animals, loading, onClose }) => {
  const navigate = useNavigate();

  if (!region) return null;

  const getRiskLevelColor = (riskLevel) => {
    if (riskLevel.toLowerCase().includes('critically endangered')) return 'error';
    if (riskLevel.toLowerCase().includes('endangered')) return 'error';
    if (riskLevel.toLowerCase().includes('vulnerable')) return 'warning';
    if (riskLevel.toLowerCase().includes('least concern')) return 'success';
    return 'default';
  };

  const handleAnimalClick = (animalId) => {
    navigate(`/animals/${animalId}`);
  };

  // Sort animals by risk level (high risk first) and then alphabetically
  const sortedAnimals = [...animals].sort((a, b) => {
    // First sort by risk level priority
    const riskComparison = getRiskLevelPriority(a.risk_level) - getRiskLevelPriority(b.risk_level);
    
    // If risk levels are the same, sort alphabetically by name
    if (riskComparison === 0) {
      return a.name.localeCompare(b.name);
    }
    
    return riskComparison;
  });

  // Group animals by risk level
  const groupedAnimals = sortedAnimals.reduce((groups, animal) => {
    const riskLevel = animal.risk_level;
    if (!groups[riskLevel]) {
      groups[riskLevel] = [];
    }
    groups[riskLevel].push(animal);
    return groups;
  }, {});

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 350,
        maxHeight: 'calc(100vh - 140px)',
        overflow: 'auto',
        zIndex: 1000,
        p: 2
      }}
      elevation={3}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {region.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {region.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {region.description}
        </Typography>
      )}

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Animals in this region:
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {Object.entries(groupedAnimals).map(([riskLevel, animals], index) => (
            <React.Fragment key={riskLevel}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 1, mb: 0.5, px: 2 }}
              >
                {riskLevel}
              </Typography>
              {animals.map((animal) => (
                <ListItem 
                  key={animal.id}
                  button 
                  onClick={() => handleAnimalClick(animal.id)}
                  sx={{
                    mb: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Animal Image */}
                    <Grid item xs={4}>
                      {animal.image_url ? (
                        <Box
                          component="img"
                          src={`http://localhost:5000${animal.image_url}`}
                          alt={animal.name}
                          sx={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100px',
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Animal Details */}
                    <Grid item xs={8}>
                      <Typography variant="subtitle1" component="div">
                        {animal.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {animal.scientific_name}
                      </Typography>
                      <Chip
                        size="small"
                        label={animal.risk_level}
                        color={getRiskLevelColor(animal.risk_level)}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RegionInfo; 