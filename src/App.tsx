import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Index from './pages/Index';
import Patients from './pages/Patients';
import Professionals from './pages/Professionals';
import Horses from './pages/Horses';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import Schedule from './pages/Schedule';
import ProfessionalHours from './pages/ProfessionalHours';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/horses" element={<Horses />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/professional-hours" element={<ProfessionalHours />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
