import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, useParams, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InstanceProvider } from './context/InstanceContext';
import GlobalStyles from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/Theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ClientScheduling from './pages/ClientScheduling';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import OrderSystem from './pages/OrderSystem';
import Chat from './components/Chat';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import LoginComponent from './components/LoginComponent';
import ProtectedRoute from './components/ProtectedRoute';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import TrendDetails from './pages/TrendDetails';
import CouponPage from './pages/CouponPage';
import Services from './pages/Services';
import Gallery from './pages/Gallery';

const MainContent = styled.main`
  padding-top: 60px;
  min-height: calc(100vh - 60px);
`;

function AppContent() {
  const { theme, isDarkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Chat />
      <Footer />
    </StyledThemeProvider>
  );
}

const InstanceWrapper = ({ children }) => {
    return (
        <InstanceProvider>
            {children}
        </InstanceProvider>
    );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route element={<InstanceWrapper><AppContent /></InstanceWrapper>}>
                {/* Super admin routes are top-level and don't have an instanceId */}
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/super-admin" element={
                    <ProtectedRoute>
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Instance routes are nested to inherit the instanceId from the URL */}
                <Route path="/:instanceId">
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="schedule" element={<ClientScheduling />} />
                    <Route path="login" element={<LoginComponent />} />
                    <Route path="admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="order" element={<OrderSystem />} />
                    <Route path="appointment-confirmation/:id" element={<AppointmentConfirmation />} />
                    <Route path="carousel/:id" element={<TrendDetails />} />
                    <Route path="coupon" element={<CouponPage />} />
                    <Route path="services" element={<Services />} />
                    <Route path="gallery" element={<Gallery />} />
                </Route>

                {/* Redirect root path to the super admin login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}