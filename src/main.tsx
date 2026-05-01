import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import DashboardLayout from './components/admin/DashboardLayout.tsx';
import ProjectsAdmin from './components/admin/ProjectsAdmin.tsx';
import SettingsAdmin from './components/admin/SettingsAdmin.tsx';
import MessagesAdmin from './components/admin/MessagesAdmin.tsx';
import AdminsAdmin from './components/admin/AdminsAdmin.tsx';
import HeroAdmin from './components/admin/HeroAdmin.tsx';
import ServicesAdmin from './components/admin/ServicesAdmin.tsx';
import Login from './components/admin/Login.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<ProjectsAdmin />} />
          <Route path="hero" element={<HeroAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="admins" element={<AdminsAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
