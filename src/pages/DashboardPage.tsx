import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/common';
import { useAuthStore } from '../store';
import { Bookmark, ShoppingBag, MapPin, LogOut, Calendar, Utensils, Heart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { icon: Bookmark, label: 'Total Bookings', value: '12' },
    { icon: ShoppingBag, label: 'Orders Completed', value: '28' },
    { icon: MapPin, label: 'Favorite Cafés', value: '5' },
  ];

  const recentBookings = [
    { id: 1, café: 'Brew Haven', date: 'Feb 14, 2026', status: 'Confirmed' },
    { id: 2, café: 'Coffee Corner', date: 'Feb 12, 2026', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-coffee-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="section-title">Welcome, {user?.email?.split('@')[0] || 'Guest'}!</h1>
            <p className="section-subtitle">Your coffee journey awaits</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-coffee-100 p-3 rounded-lg">
                      <Icon size={24} className="text-coffee-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/cafes">
                <Button variant="secondary" size="sm">
                  <Calendar size={16} className="mr-1" />
                  Book Another
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.café}</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={32} className="mx-auto mb-2 text-coffee-200" />
                  <p>No recent bookings. Start exploring cafés!</p>
                  <Link to="/cafes" className="mt-3 inline-block">
                    <Button size="sm" className="mt-2">
                      <Calendar size={16} className="mr-1" />
                      Browse Cafés
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.4 }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/cafes">
              <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} className="text-coffee-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book a Table</h3>
                <p className="text-gray-600 mb-6">Reserve your spot at any café</p>
                <Button fullWidth>
                  <Calendar size={18} className="mr-2" />
                  Explore Cafés
                </Button>
              </Card>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/profile">
              <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="text-coffee-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">View Profile</h3>
                <p className="text-gray-600 mb-6">Update your information</p>
                <Button fullWidth variant="secondary">
                  <User size={18} className="mr-2" />
                  Profile Settings
                </Button>
              </Card>
            </Link>
          </motion.div>
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.6 }}
        >
          <Link to="/cafes">
            <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={28} className="text-coffee-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Favorites</h3>
              <p className="text-gray-600 mb-6">View your saved cafés</p>
              <Button fullWidth variant="secondary">
                <Heart size={18} className="mr-2" />
                My Favorites
              </Button>
            </Card>
          </Link>
          <Link to="/orders">
            <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={28} className="text-coffee-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order History</h3>
              <p className="text-gray-600 mb-6">Track past orders</p>
              <Button fullWidth variant="secondary">
                <Utensils size={18} className="mr-2" />
                View Orders
              </Button>
            </Card>
          </Link>
          <Link to="/payments">
            <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} className="text-coffee-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payments</h3>
              <p className="text-gray-600 mb-6">View payment history</p>
              <Button fullWidth variant="secondary">
                <ShoppingBag size={18} className="mr-2" />
                Payment History
              </Button>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};