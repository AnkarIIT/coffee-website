import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/common';
import { Link } from 'react-router-dom';
import { Coffee, Clock, MapPin, Star, Search, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { Cafe } from '../types';

export const CaféListPage: React.FC = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchCafes();
  }, [currentPage, searchQuery]);

  const fetchCafes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getCafes({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
      });
      setCafes(response.items);
      setTotalPages(Math.ceil(response.total / response.pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cafés');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCafes();
  };

  if (isLoading && cafes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="section-title">Discover Local Cafés</h1>
            <p className="section-subtitle">Find your perfect coffee spot</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="h-32 bg-gray-200 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="section-title">Discover Local Cafés</h1>
              <p className="section-subtitle">Find your perfect coffee spot</p>
            </div>
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search cafés..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="input-field pl-10 pr-4"
                aria-label="Search cafés"
              />
            </form>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={fetchCafes} className="ml-auto">
              Retry
            </Button>
          </motion.div>
        )}

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {cafes.length > 0 ? (
            cafes.map((cafe, index) => (
              <motion.div
                key={cafe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex flex-col h-full p-6">
                  <div className="bg-coffee-100 h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {cafe.image ? (
                      <img
                        src={cafe.image}
                        alt={cafe.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Coffee size={48} className="text-coffee-600" />
                    )}
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
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{cafe.rating}</span>
                      <span className="text-gray-500 text-sm">({cafe.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="px-2 py-1 bg-coffee-100 rounded-full text-xs font-medium text-coffee-700">
                        {cafe.cuisine}
                      </span>
                    </div>
                  </div>

                  <Link to={`/cafe/${cafe.id}`} className="w-full">
                    <Button fullWidth>
                      View Details
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee size={40} className="text-coffee-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No cafés found' : 'No cafés available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Check back soon for new cafés in your area!'}
              </p>
              {searchQuery && (
                <Button variant="secondary" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};