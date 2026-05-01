import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import DashboardLayout from './components/admin/DashboardLayout.tsx';
import ProjectsAdmin from './components/admin/ProjectsAdmin.tsx';
import SettingsAdmin from './components/admin/SettingsAdmin.tsx';
import MessagesAdmin from './components/admin/MessagesAdmin.tsx';
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
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
