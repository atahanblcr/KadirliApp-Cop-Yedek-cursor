import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Pharmacies from './pages/Pharmacies';
import Ads from './pages/Ads';
import Users from './pages/Users';
import { Title } from '@mantine/core';

// Geçici (Placeholder) Sayfalar
const Dashboard = () => <Title>Hoşgeldin Admin! 👋</Title>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Herkese Açık Sayfa */}
        <Route path="/login" element={<Login />} />

        {/* Korumalı Sayfalar (Giriş Yapmayan Göremez) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;