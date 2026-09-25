import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/common/Button';
import { api } from '../../services/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await api.forgotPassword(data.email);
      setStep('success');
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-coffee-50 to-orange-50">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center gap-2 mb-8"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/login" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-bold text-coffee-600">BREWLYN</h1>
          </motion.div>

          {step === 'email' && (
            <>
              <motion.div
                className="text-center mb-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
              </motion.div>

              <motion.form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                variants={itemVariants}
              >
                <motion.div variants={itemVariants}>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email"
                    label="Email Address"
                    icon={<Mail size={20} />}
                    error={errors.email?.message}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isSubmitting}
                    className="flex items-center justify-center gap-2"
                  >
                    Send Reset Link <Mail size={20} />
                  </Button>
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-coffee-600 font-semibold hover:underline">
                    Login here
                  </Link>
                </motion.p>
              </motion.form>
            </>
          )}

          {step === 'success' && (
            <>
              <motion.div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                variants={itemVariants}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <CheckCircle size={40} className="text-green-600" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-3 text-center"
                variants={itemVariants}
              >
                Check Your Email
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-8 text-center"
                variants={itemVariants}
              >
                We've sent a password reset link to your email. Please check your inbox and follow the instructions.
              </motion.p>

              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                <Link to="/login">
                  <Button fullWidth className="flex items-center justify-center gap-2">
                    Back to Login <ArrowLeft size={20} />
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

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