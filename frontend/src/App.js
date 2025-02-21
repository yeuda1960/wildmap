import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Map from './components/map/Map';
import AnimalList from './components/animals/AnimalList';
import AnimalDetail from './components/animals/AnimalDetail';
import UserProfile from './components/user/UserProfile';
import PrivateRoute from './components/auth/PrivateRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green color for nature theme
    },
    secondary: {
      main: '#ff9800', // Orange for contrast
    },
  },
});

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {isAuthenticated && <Navbar />}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/map" replace /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/map" replace /> : <Register />
            } />

            {/* Protected Routes */}
            <Route path="/map" element={
              <PrivateRoute>
                <Map />
              </PrivateRoute>
            } />
            <Route path="/animals" element={
              <PrivateRoute>
                <AnimalList />
              </PrivateRoute>
            } />
            <Route path="/animals/:id" element={
              <PrivateRoute>
                <AnimalDetail />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />

            {/* Default Route */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/map" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 