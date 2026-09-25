import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useUiStore } from '../../store';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUiStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cafes', label: 'Discover Cafés' },
  ];

  const authenticatedLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-lg"
      role="navigation"
      aria-label="Main navigation"
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
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-2xl text-coffee-600"
              aria-label="BREWLYN Home"
            >
              <div className="w-10 h-10 bg-coffee-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">
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
            className="hidden md:flex items-center gap-6"
            role="menubar"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                custom={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                role="none"
              >
                <Link
                  to={link.to}
                  className={`text-gray-700 hover:text-coffee-600 transition-colors px-3 py-2 rounded-lg ${
                    location.pathname === link.to ? 'text-coffee-600 bg-coffee-50 font-medium' : ''
                  }`}
                  role="menuitem"
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {isAuthenticated && user && authenticatedLinks.map((link, index) => (
              <motion.div
                key={link.to}
                custom={index + navLinks.length}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                role="none"
              >
                <Link
                  to={link.to}
                  className={`flex items-center gap-2 text-gray-700 hover:text-coffee-600 transition-colors px-3 py-2 rounded-lg ${
                    location.pathname === link.to ? 'text-coffee-600 bg-coffee-50 font-medium' : ''
                  }`}
                  role="menuitem"
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                >
                  {link.icon && <link.icon size={18} className="text-coffee-600" />}
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Auth Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center gap-4"
          >
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <User size={20} className="text-coffee-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-700 truncate max-w-[150px]">{user.email}</span>
                  <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
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
                      role="menu"
                    >
                      {authenticatedLinks.map((link, _index) => (
                        <motion.button
                          key={link.to}
                          onClick={() => {
                            navigate(link.to);
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          whileHover={{ paddingLeft: 20 }}
                          role="menuitem"
                        >
                          {link.icon && <link.icon size={18} />}
                          <span>{link.label}</span>
                        </motion.button>
                      ))}
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100"
                        whileHover={{ paddingLeft: 20 }}
                        role="menuitem"
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
                  className="px-4 py-2 rounded-lg border-2 border-coffee-600 text-coffee-600 text-sm font-semibold hover:bg-coffee-50 transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 rounded-lg bg-coffee-600 text-white text-sm font-semibold hover:bg-coffee-700 transition-colors"
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
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="text-coffee-600" size={24} aria-hidden="true" />
            ) : (
              <Menu className="text-coffee-600" size={24} aria-hidden="true" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200 shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="px-4 py-4 space-y-2">
                {[
                  ...navLinks,
                  ...(isAuthenticated ? authenticatedLinks : []),
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
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.to
                          ? 'bg-coffee-50 text-coffee-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleMobileMenu()}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={navItemVariants}
                  custom={navLinks.length + (isAuthenticated ? authenticatedLinks.length : 0)}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-2 pt-4 border-t border-gray-200"
                >
                  {isAuthenticated ? (
                    <motion.button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-3 rounded-lg bg-coffee-600 text-white text-sm font-semibold hover:bg-coffee-700 transition-colors"
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
                        className="flex-1 px-4 py-3 rounded-lg border-2 border-coffee-600 text-coffee-600 text-sm font-semibold hover:bg-coffee-50 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        Login
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          navigate('/register');
                          toggleMobileMenu();
                        }}
                        className="flex-1 px-4 py-3 rounded-lg bg-coffee-600 text-white text-sm font-semibold hover:bg-coffee-700 transition-colors"
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