import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useUiStore } from '../../store';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUiStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, x: -300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-coffee-600">
              <div className="w-10 h-10 bg-coffee-600 rounded-full flex items-center justify-center text-white">
                ☕
              </div>
              <span className="hidden sm:inline">BREWLYN</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link to="/" className="text-gray-700 hover:text-coffee-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-coffee-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-coffee-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-coffee-600 transition-colors">
              Contact
            </Link>
          </motion.div>

          {/* Auth Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center gap-4"
          >
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={20} className="text-coffee-600" />
                  <span className="text-sm font-semibold text-gray-700">{user.email}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <motion.button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        whileHover={{ paddingLeft: 20 }}
                      >
                        <Settings size={18} />
                        <span>Profile Settings</span>
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100"
                        whileHover={{ paddingLeft: 20 }}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="btn-outline text-sm"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="btn-primary text-sm"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <X className="text-coffee-600" size={24} />
            ) : (
              <Menu className="text-coffee-600" size={24} />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-50 border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-3">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'Products' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact' },
                ].map((item, i) => (
                  <motion.div
                    key={item.to}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.to}
                      className="block px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors"
                      onClick={() => toggleMobileMenu()}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={navItemVariants}
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-2 pt-4 border-t border-gray-200"
                >
                  {isAuthenticated ? (
                    <motion.button
                      onClick={handleLogout}
                      className="flex-1 btn-primary text-sm"
                      whileTap={{ scale: 0.95 }}
                    >
                      Logout
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => {
                          navigate('/login');
                          toggleMobileMenu();
                        }}
                        className="flex-1 btn-outline text-sm"
                        whileTap={{ scale: 0.95 }}
                      >
                        Login
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          navigate('/register');
                          toggleMobileMenu();
                        }}
                        className="flex-1 btn-primary text-sm"
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign Up
                      </motion.button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
