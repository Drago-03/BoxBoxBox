import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Glossary } from './pages/Glossary';
import { AIAssistant } from './pages/AIAssistant';
import { PitStopPredictor } from './pages/PitStopPredictor';
import { StrategySimulator } from './pages/StrategySimulator';
import { Home } from './pages/Home';

// Import providers and loading screen
import { LoadingProvider } from './context/LoadingContext';
import { TelemetryProvider } from './context/TelemetryContext';
import LoadingScreen from './components/LoadingScreen';

function App() {
  return (
    <LoadingProvider>
      <TelemetryProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Loading Screen */}
            <LoadingScreen />
            
            {/* Main content */}
            <Navigation />
            
            <div className="pt-16 container mx-auto px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/assistant" element={<AIAssistant />} />
                <Route path="/predictor" element={<PitStopPredictor />} />
                <Route path="/simulator" element={<StrategySimulator />} />
              </Routes>
            </div>
          </div>
        </Router>
      </TelemetryProvider>
    </LoadingProvider>
  );
}

export default App;