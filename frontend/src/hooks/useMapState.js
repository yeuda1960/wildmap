import { useState, useCallback } from 'react';
import axios from 'axios';

export const useMapState = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnimalsInRegion = useCallback(async (regionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/regions/${regionId}`);
      setAnimals(response.data.animals);
      setSelectedRegion(response.data);
    } catch (err) {
      setError('Failed to load animals for this region.');
      console.error('Error fetching animals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRegion(null);
    setAnimals([]);
  }, []);

  return {
    selectedRegion,
    animals,
    loading,
    error,
    fetchAnimalsInRegion,
    clearSelection
  };
};

export default useMapState; 