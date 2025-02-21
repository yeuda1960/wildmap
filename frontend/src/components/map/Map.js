import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Container, Typography, Paper, CircularProgress, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { ENDPOINTS } from '../../config/api';
import { madagascarRegions } from '../../data/madagascarRegions';
import RegionInfo from './RegionInfo';
import './Map.css';

// Madagascar's approximate bounds
const MADAGASCAR_BOUNDS = {
  center: [-18.7669, 46.8691],
  zoom: 6
};

const Map = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNoInfoError, setShowNoInfoError] = useState(false);

  const fetchAnimalsForRegion = async (regionId) => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.REGIONS.DETAIL(regionId));
      console.log('Region data:', response.data);
      
      if (response.data && response.data.animals) {
        setAnimals(response.data.animals);
        setError(null);
      } else {
        setError('No animals found in this region');
        setAnimals([]);
      }
    } catch (err) {
      console.error('Error details:', err.response || err);
      if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to the server. Please make sure the backend is running.');
      } else if (err.response?.status === 404) {
        setError('Region information not found');
      } else {
        setError('Failed to load region information. Please try again later.');
      }
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  const onEachRegion = (feature, layer) => {
    // Bind popup to show region name on hover
    layer.bindTooltip(feature.properties.name, {
      permanent: false,
      direction: 'center',
      className: 'region-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 3
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.5,
          weight: 2
        });
      },
      click: (e) => {
        setActiveRegion(feature.properties);
        fetchAnimalsForRegion(feature.properties.id);
      }
    });
  };

  const handleCloseRegionInfo = () => {
    setActiveRegion(null);
    setAnimals([]);
  };

  const handleMapClick = (e) => {
    // Check if click is outside the regions
    const clickedOnRegion = e.target.className && e.target.className.includes('leaflet-interactive');
    if (!clickedOnRegion) {
      setShowNoInfoError(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Madagascar Wildlife Map
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Click on regions to view wildlife information. Hover over regions to see their names.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        position: 'relative',
        height: '600px', 
        width: '100%',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          borderRadius: '4px'
        }
      }}>
        <MapContainer
          center={MADAGASCAR_BOUNDS.center}
          zoom={MADAGASCAR_BOUNDS.zoom}
          style={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={madagascarRegions}
            onEachFeature={onEachRegion}
            style={{
              fillColor: '#2e7d32',
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.5
            }}
          />
        </MapContainer>

        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              p: 2,
              borderRadius: 2
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <RegionInfo
          region={activeRegion}
          animals={animals}
          loading={loading}
          onClose={handleCloseRegionInfo}
        />

        <Snackbar
          open={showNoInfoError}
          autoHideDuration={3000}
          onClose={() => setShowNoInfoError(false)}
          message="You clicked on an area with no information"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
};

export default Map;
 