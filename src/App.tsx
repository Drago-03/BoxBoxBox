import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Glossary } from './pages/Glossary';
import { AIAssistant } from './pages/AIAssistant';
import { PitStopPredictor } from './pages/PitStopPredictor';
import { StrategySimulator } from './pages/StrategySimulator';
import { Home } from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/predictor" element={<PitStopPredictor />} />
            <Route path="/simulator" element={<StrategySimulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;