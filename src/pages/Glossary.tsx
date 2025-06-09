import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Cuboid as Cube, Info } from 'lucide-react';
import { CarVisualization } from '../components/CarVisualization';

export const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState('aerodynamics');

  const categories = ['All', 'Aerodynamics', 'Engine', 'Chassis', 'Electronics', 'Safety'];

  const glossaryTerms = [
    {
      id: 'aerodynamics',
      term: 'Aerodynamics',
      category: 'Aerodynamics',
      definition: 'The study of airflow around the car, crucial for generating downforce and reducing drag.',
      detailed: 'Aerodynamics in Formula 1 involves managing airflow to create downforce (pressing the car down for better grip) while minimizing drag (air resistance that slows the car). Teams use wings, diffusers, and body shaping to optimize aerodynamic performance.',
      has3D: true
    },
    {
      id: 'drs',
      term: 'DRS (Drag Reduction System)',
      category: 'Aerodynamics',
      definition: 'A moveable rear wing element that reduces drag to help overtaking.',
      detailed: 'DRS opens a flap in the rear wing, reducing drag by up to 40 points and increasing straight-line speed by 10-15 km/h. It can only be activated in designated zones when a driver is within 1 second of the car ahead.',
      has3D: true
    },
    {
      id: 'ers',
      term: 'ERS (Energy Recovery System)',
      category: 'Engine',
      definition: 'System that harvests and deploys energy to provide additional power.',
      detailed: 'ERS consists of two parts: ERS-K (kinetic energy recovery from braking) and ERS-H (heat energy recovery from the turbocharger). Drivers can deploy up to 33.3 seconds of 160hp per lap.',
      has3D: false
    },
    {
      id: 'floor',
      term: 'Floor',
      category: 'Aerodynamics',
      definition: 'The flat bottom of the car that generates significant downforce.',
      detailed: 'The floor is the largest aerodynamic surface on an F1 car. It works with the diffuser to create a low-pressure area underneath the car, sucking it down to the track. Modern floors are highly complex with multiple channels and vanes.',
      has3D: true
    },
    {
      id: 'halo',
      term: 'Halo',
      category: 'Safety',
      definition: 'Titanium safety device protecting the driver\'s head.',
      detailed: 'The Halo is a titanium structure that sits above the cockpit, designed to deflect debris and protect the driver\'s head in accidents. It can withstand forces equivalent to the weight of a London bus.',
      has3D: true
    }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedTermData = glossaryTerms.find(term => term.id === selectedTerm);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-green-500" />
            F1 Technical Glossary
          </h1>
          <p className="text-gray-400">
            Interactive 3D visualizations and detailed explanations of Formula 1 technical terms
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search technical terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Terms List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Terms ({filteredTerms.length})
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTerms.map((term) => (
                  <button
                    key={term.id}
                    onClick={() => setSelectedTerm(term.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedTerm === term.id
                        ? 'bg-green-600/20 border border-green-500/50 text-green-400'
                        : 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{term.term}</div>
                        <div className="text-xs text-gray-400 mt-1">{term.category}</div>
                      </div>
                      {term.has3D && (
                        <Cube className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Term Details and 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedTermData && (
              <>
                {/* 3D Visualization */}
                {selectedTermData.has3D && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Cube className="w-5 h-5 mr-2 text-blue-500" />
                      3D Visualization
                    </h3>
                    <CarVisualization selectedComponent={selectedTermData.id} />
                  </div>
                )}

                {/* Term Details */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{selectedTermData.term}</h2>
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">
                      {selectedTermData.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        Quick Definition
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedTermData.definition}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">
                        Detailed Explanation
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedTermData.detailed}
                      </p>
                    </div>

                    {selectedTermData.has3D && (
                      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-400 text-sm">
                          <Cube className="w-4 h-4" />
                          <span>Interactive 3D model available above</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};