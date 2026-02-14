import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/common';
import { Link } from 'react-router-dom';
import { Coffee, Clock, MapPin } from 'lucide-react';

export const CaféListPage: React.FC = () => {
  // Sample data - replace with API call
  const cafes = [
    {
      id: '1',
      name: 'Brew Haven',
      location: 'Downtown',
      rating: 4.8,
      distance: '0.5 km',
      openingHours: { open: '7:00 AM', close: '10:00 PM' },
    },
    {
      id: '2',
      name: 'Coffee Corner',
      location: 'City Center',
      rating: 4.6,
      distance: '1.2 km',
      openingHours: { open: '8:00 AM', close: '9:00 PM' },
    },
    {
      id: '3',
      name: 'The Daily Grind',
      location: 'Business District',
      rating: 4.7,
      distance: '2.1 km',
      openingHours: { open: '6:30 AM', close: '11:00 PM' },
    },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-coffee-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="section-title">Discover Local Cafés</h1>
          <p className="section-subtitle">Find your perfect coffee spot</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {cafes.map((cafe, index) => (
            <motion.div
              key={cafe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex flex-col h-full p-6">
                <div className="bg-coffee-100 h-32 rounded-lg mb-4 flex items-center justify-center">
                  <Coffee size={48} className="text-coffee-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cafe.name}</h3>
                
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{cafe.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">{cafe.openingHours.open} - {cafe.openingHours.close}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">{cafe.rating}</span>
                    <span className="text-gray-500 text-sm">• {cafe.distance}</span>
                  </div>
                </div>

                <Link to={`/cafe/${cafe.id}`} className="w-full">
                  <Button fullWidth>
                    View Details
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
