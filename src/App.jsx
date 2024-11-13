import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/Theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ClientScheduling from './pages/ClientScheduling';
import AdminDashboard from './pages/AdminDashboard';
import OrderSystem from './pages/OrderSystem';
import Chat from './components/Chat';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import LoginComponent from './components/LoginComponent';
import ProtectedRoute from './components/ProtectedRoute';
import AppointmentConfirmation from './pages/AppointmentConfirmation';

const MainContent = styled.main`
  padding-top: 60px;
  min-height: calc(100vh - 60px);
`;

function AppContent() {
  const { theme, isDarkMode } = useTheme();

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/schedule" element={<ClientScheduling />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/order" element={<OrderSystem />} />            
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/appointment-confirmation/:id" element={<AppointmentConfirmation />} />
        </Routes>
      </MainContent>
      <Chat />
      <Footer />
    </StyledThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}