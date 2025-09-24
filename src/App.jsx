import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import CouponPage from './pages/CouponPage';
import OrderSystem from './pages/OrderSystem';
import TrendDetails from './pages/TrendDetails';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeContext } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import { InstanceProvider } from './context/InstanceContext';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/super-admin" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />

            <Route path="/:instanceId/*" element={
              <InstanceProvider>
                <InstanceRoutes />
              </InstanceProvider>
            } />

            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </StyledThemeProvider>
  );
}

function InstanceRoutes() {
  return (
    <Routes>
      <Route path="schedule" element={<ClientScheduling />} />
      <Route path="appointment-confirmation/:id" element={<AppointmentConfirmation />} />
      <Route path="login" element={<Login />} />
      <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="services" element={<Services />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="contact" element={<Contact />} />
      <Route path="coupons" element={<CouponPage />} />
      <Route path="order" element={<OrderSystem />} />
      <Route path="trends/:id" element={<TrendDetails />} />
      <Route path="portfolio" element={<Portfolio />} />
    </Routes>
  );
}

export default App;
