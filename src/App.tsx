import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TradeProvider } from './context/TradeContext';
import Layout from './components/Layout';
import Console from './pages/Console';
import Lattice from './pages/Lattice';
import TradePro from './pages/TradePro';
import Markets from './pages/Markets';
import Ledger from './pages/Ledger';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Codex from './pages/Codex';
import MapPage from './pages/Map';
import Verify from './pages/Verify';

const App: React.FC = () => {
  return (
    <TradeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Console />} />
            <Route path="lattice" element={<Lattice />} />
            <Route path="tradepro" element={<TradePro />} />
            <Route path="markets" element={<Markets />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="verify" element={<Verify />} />
            <Route path="codex" element={<Codex />} />
            <Route path="map" element={<MapPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TradeProvider>
  );
};

export default App;
