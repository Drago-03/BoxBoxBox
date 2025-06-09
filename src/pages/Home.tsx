import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Activity, BookOpen, MessageSquare, Timer, Target, ChevronRight } from 'lucide-react';

export const Home: React.FC = () => {
  const features = [
    {
      icon: Activity,
      title: 'Live Dashboard',
      description: 'Real-time telemetry, lap times, and race analytics powered by FastF1',
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Technical Glossary',
      description: '3D interactive car parts with detailed explanations',
      path: '/glossary',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'RAG-powered F1 expert for rules, strategy, and technical questions',
      path: '/assistant',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Timer,
      title: 'Pit Stop Predictor',
      description: 'ML-powered predictions for pit stop timing and duration',
      path: '/predictor',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Target,
      title: 'Strategy Simulator',
      description: 'Test different race strategies and see projected outcomes',
      path: '/simulator',
      color: 'from-red-500 to-red-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10 rounded-full blur-3xl transform -rotate-12 scale-150"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              BoxBoxBox
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            The complete AI-enhanced Formula 1 platform combining real-time data, 
            machine learning predictions, and interactive 3D visualizations
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-semibold text-white hover:from-red-500 hover:to-red-400 transform hover:scale-105 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2"
            >
              <Activity className="w-5 h-5" />
              <span>View Live Dashboard</span>
            </Link>
            <Link
              to="/assistant"
              className="px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-xl font-semibold text-white hover:bg-gray-700/50 transform hover:scale-105 transition-all backdrop-blur-sm flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Try AI Assistant</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for F1 Analysis
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From live telemetry to AI-powered predictions, explore Formula 1 like never before
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link
                  to={feature.path}
                  className="block p-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gray-100">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-400">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6">
              <div className="text-4xl font-bold text-red-500 mb-2">Real-time</div>
              <div className="text-gray-400">Live telemetry data</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-500 mb-2">AI-Powered</div>
              <div className="text-gray-400">Machine learning predictions</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">Interactive</div>
              <div className="text-gray-400">3D visualizations</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};