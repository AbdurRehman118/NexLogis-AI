import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RateAggregator from './pages/RateAggregator';
import RateUpload from './pages/RateUpload';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="aggregator" element={<RateAggregator />} />
          <Route path="upload" element={<RateUpload />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          {/* Legacy redirects */}
          <Route path="calculator" element={<RateAggregator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
