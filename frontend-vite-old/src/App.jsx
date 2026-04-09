import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import AboutAvyakta from './pages/AboutAvyakta';
import AboutIRA from './pages/AboutIRA';
import MandalaLoader from './components/shared/MandalaLoader';

const App = () => {
  return (
    <BrowserRouter>
      {/* Global initial loader */}
      <MandalaLoader />

      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutAvyakta />} />
          <Route path="about-ira" element={<AboutIRA />} />

          {/* Placeholders for other pages to avoid 404s */}
          <Route
            path="events"
            element={
              <div className="h-screen flex items-center justify-center text-bronze-gold font-cormorant text-2xl">
                Events Coming Soon
              </div>
            }
          />
          <Route
            path="gallery"
            element={
              <div className="h-screen flex items-center justify-center text-bronze-gold font-cormorant text-2xl">
                Gallery Coming Soon
              </div>
            }
          />
          <Route
            path="recruitment"
            element={
              <div className="h-screen flex items-center justify-center text-bronze-gold font-cormorant text-2xl">
                Recruitment Coming Soon
              </div>
            }
          />
          <Route
            path="registrations"
            element={
              <div className="h-screen flex items-center justify-center text-bronze-gold font-cormorant text-2xl">
                Registrations Coming Soon
              </div>
            }
          />
          <Route
            path="members"
            element={
              <div className="h-screen flex items-center justify-center text-bronze-gold font-cormorant text-2xl">
                Members Coming Soon
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
