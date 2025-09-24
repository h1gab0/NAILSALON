import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InstanceProvider } from './context/InstanceContext';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import ClientScheduling from './pages/ClientScheduling';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// A layout component to provide consistent structure
function AppLayout() {
    const { theme } = useTheme();
    return (
        <StyledThemeProvider theme={theme}>
            <GlobalStyles />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </StyledThemeProvider>
    );
}

function InstanceRoutes() {
  return (
    <Routes>
      <Route path="schedule" element={<ClientScheduling />} />
      <Route path="login" element={<Login />} />
      <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="appointment-confirmation/:id" element={<AppointmentConfirmation />} />
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="services" element={<Services />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="contact" element={<Contact />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
            <Routes>
                <Route element={<AppLayout/>}>
                    <Route path="/super-admin" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
                    <Route path="/login/super" element={<Login superAdmin />} />

                    <Route path="/:instanceId/*" element={
                      <InstanceProvider>
                        <InstanceRoutes />
                      </InstanceProvider>
                    } />

                    {/* Fallback for root could be a landing page or redirect */}
                    <Route path="/" element={<Home />} />
                </Route>
            </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;