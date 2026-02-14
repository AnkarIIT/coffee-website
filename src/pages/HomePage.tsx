import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Clock, Users, Zap, Star, ArrowRight } from 'lucide-react';
import { Button, Card } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Reserve your table in seconds with our intuitive booking system',
    },
    {
      icon: Coffee,
      title: 'Premium Menu',
      description: 'Explore our curated selection of finest coffee and delicacies',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get live notifications on your order status from preparation to serving',
    },
    {
      icon: Users,
      title: 'Social Experience',
      description: 'Book with friends and enjoy exclusive group discounts',
    },
  ];

  {
    name: 'Sarah Johnson',
      role: 'Coffee Enthusiast',
        rating: 5,
          comment: 'Best coffee booking experience I\'ve ever had. Seamless and quick!',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Mike Chen',
      role: 'Busy Professional',
        rating: 5,
          comment: 'No more waiting in queues. I pre-order and it\'s ready when I arrive.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Emma Davis',
      role: 'Student',
        rating: 5,
          comment: 'Great way to reserve study spots and enjoy amazing coffee.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
  },
  ];

return (
  <div className="min-h-screen">
    {/* Hero Section */}
    <motion.section
      className="relative px-4 sm:px-6 lg:px-8 py-32 md:py-48 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-coffee-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 left-10 w-72 h-72 bg-coffee-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              It's a Break with <span className="text-coffee-600">COFFEE</span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Book your perfect café experience. Pre-order your favorite dishes, secure your spot at premium cafés, and enjoy hassle-free dining with real-time order tracking.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {isAuthenticated ? (
                <>
                  <Link to="/cafes">
                    <Button className="flex items-center gap-2">
                      Explore Cafés <ArrowRight size={20} />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="secondary">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="flex items-center gap-2">
                      Get Started <ArrowRight size={20} />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative h-96 md:h-[600px] w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-coffee-100 to-coffee-50 rounded-[2rem] transform -rotate-3 scale-95" />
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
              alt="Coffee Shop Atmosphere"
              className="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>

    {/* Features Section */}
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-32 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="section-title">Why Choose BREWLYN?</h2>
          <p className="section-subtitle">Everything you need for the perfect café experience</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-6">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center">
                      <Icon size={32} className="text-coffee-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>

    {/* Testimonials Section */}
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-32 bg-gradient-to-br from-coffee-50 to-orange-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Join thousands of happy customers</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-coffee-100"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-coffee-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

    {/* CTA Section */}
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-4xl font-bold text-gray-900 mb-6" variants={itemVariants}>
          Ready to Reserve Your Spot?
        </motion.h2>
        <motion.p className="text-lg text-gray-600 mb-8" variants={itemVariants}>
          Join our community and enjoy premium café experiences with organized booking and pre-ordering.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to={isAuthenticated ? '/cafes' : '/register'}>
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              {isAuthenticated ? 'Explore Cafés' : 'Get Started Now'} <ArrowRight size={24} />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  </div>
);
};
