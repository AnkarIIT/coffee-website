import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Coffee, Heart, Share2, ArrowLeft, CheckCircle, AlertCircle, Calendar, Users, Utensils, User as UserIcon } from 'lucide-react';
import { Button, Card } from '../../components/common/Button';
import { useAuthStore, useCafeSelectionStore } from '../../store';
import { api } from '../../services/api';
import type { Cafe, MenuItem } from '../../types';

export const CafeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setSelectedCafe } = useCafeSelectionStore();

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'reviews'>('info');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchCafe = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [cafeData, menuData] = await Promise.all([
          api.getCafeById(id),
          api.getCafeMenu(id),
        ]);
        setCafe(cafeData);
        setMenu(menuData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load café details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCafe();
  }, [id]);

  const handleBookTable = async () => {
    if (!cafe || !isAuthenticated) return;
    setIsBooking(true);
    try {
      setSelectedCafe(cafe.id);
      navigate('/booking');
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
    }
  };

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl" />
              <div className="bg-white p-6 rounded-xl" />
              <div className="bg-white p-6 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-orange-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Café Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The café you\'re looking for doesn\'t exist.'}</p>
          <Link to="/cafes">
            <Button className="flex items-center gap-2 mx-auto">
              <ArrowLeft size={20} />
              Back to Cafés
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const openingHours = `${cafe.openingHours.open} - ${cafe.openingHours.close}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50">
      {/* Hero Image */}
      <motion.section
        className="relative h-96 md:h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end p-8">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <Link
                  to="/cafes"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Cafés
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{cafe.name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Star size={16} className="text-yellow-300 fill-yellow-300" />
                    <span className="font-semibold">{cafe.rating}</span>
                    <span className="text-gray-300">({cafe.totalReviews} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    <MapPin size={16} />
                    <span>{cafe.location}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Clock size={16} />
                    <span>{openingHours}</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                  <Heart size={20} />
                  Save
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                  <Share2 size={20} />
                  Share
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section
        className="relative -mt-10 px-4 sm:px-6 lg:px-8 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Café details tabs">
                {[
                  { id: 'info', label: 'Info', icon: Coffee },
                  { id: 'menu', label: 'Menu', icon: Utensils },
                  { id: 'reviews', label: 'Reviews', icon: Star },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-coffee-600 border-b-2 border-coffee-600 bg-coffee-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'info' && (
                <motion.div
                  className="space-y-8"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin size={28} className="text-coffee-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-600">{cafe.location}</p>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={28} className="text-coffee-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Hours</h3>
                      <p className="text-gray-600">{openingHours}</p>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coffee size={28} className="text-coffee-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuisine</h3>
                      <p className="text-gray-600 capitalize">{cafe.cuisine}</p>
                    </Card>
                  </div>

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About This Café</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Welcome to {cafe.name}, your premier destination for exceptional coffee and dining experiences.
                      Located in the heart of {cafe.location}, we pride ourselves on serving the finest beverages
                      crafted by our expert baristas using locally sourced, premium ingredients.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: Wifi, label: 'Free WiFi' },
                        { icon: Power, label: 'Power Outlets' },
                        { icon: Music, label: 'Background Music' },
                        { icon: Car, label: 'Parking Available' },
                        { icon: Dog, label: 'Pet Friendly' },
                        { icon: Utensils, label: 'Full Menu' },
                      ].map((feature, i) => (
                        <Card key={i} className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                          <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center">
                            <feature.icon size={20} className="text-coffee-600" />
                          </div>
                          <span className="font-medium text-gray-900">{feature.label}</span>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'menu' && (
                <motion.div
                  className="space-y-8"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {Object.entries(groupedMenu).map(([category, items], catIndex) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{category}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {items.map((item, itemIndex) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIndex * 0.1 + itemIndex * 0.05 }}
                          >
                            <Card className="p-4 flex flex-col">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                                </div>
                                <span className="text-coffee-600 font-bold text-lg">${item.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {item.preparationTime} min
                                </span>
                                {!item.isAvailable && (
                                  <span className="text-red-500 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    Unavailable
                                  </span>
                                )}
                              </div>
                              <Button
                                fullWidth
                                size="sm"
                                disabled={!item.isAvailable}
                                variant={item.isAvailable ? 'primary' : 'secondary'}
                              >
                                Add to Order
                              </Button>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groupedMenu).length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Coffee size={48} className="mx-auto mb-4 text-coffee-200" />
                      <p>No menu items available at this café.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  className="space-y-6"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                    <Button variant="secondary">
                      Write a Review
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-6">
                        <div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center">
  <div className="text-coffee-600">
    <UserIcon size={24} />
  </div>
</div>
                          <div>
                            <p className="font-semibold text-gray-900">Customer {i}</p>
                            <p className="text-sm text-gray-500">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "Great coffee and amazing atmosphere! The staff is friendly and the pastries are fresh daily.
                          Perfect spot for working or meeting friends."
                        </p>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Book Table CTA */}
          {isAuthenticated && (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-coffee-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Visit?</h3>
                <p className="text-gray-600 mb-6">
                  Book your table now and enjoy a seamless café experience at {cafe.name}.
                </p>
                <Button
                  size="lg"
                  className="flex items-center gap-2 mx-auto"
                  onClick={handleBookTable}
                  isLoading={isBooking}
                >
                  <CheckCircle size={20} />
                  Book a Table
                </Button>
              </div>
            </motion.div>
          )}

          {!isAuthenticated && (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-coffee-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Book Your Table</h3>
                <p className="text-gray-600 mb-6">
                  Sign in or create an account to reserve your spot at {cafe.name}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login">
                    <Button variant="secondary" className="flex items-center gap-2">
                      <ArrowLeft size={20} />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="flex items-center gap-2">
                      Sign Up <ArrowLeft size={20} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

// Missing icons
const Wifi = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);
const Power = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>
  </svg>
);
const Music = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
  </svg>
);
const Car = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle>
  </svg>
);
const Dog = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 0 1-9-9h0a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2h0a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2h0a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2h0a9 9 0 0 1-9 9"></path>
  </svg>
);