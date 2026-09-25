import React from 'react';
import { motion } from 'framer-motion';
import { RegisterForm } from '../../components/auth/AuthForms';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-coffee-50 to-orange-50">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-coffee-600 mb-2">BREWLYN</h1>
            <p className="text-gray-600">Join us for amazing café experiences</p>
          </motion.div>

          <RegisterForm />
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-coffee-200 rounded-full mix-blend-multiply filter blur-lg opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-20 h-20 bg-orange-200 rounded-full mix-blend-multiply filter blur-lg opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </motion.div>
    </div>
  );
};