import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import { Button, Input } from '../../components/common/Button';
import { api } from '../../services/api';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  useEffect(() => {
    if (!token) {
      setStep('error');
      setErrorMessage('Invalid or missing reset token.');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await api.resetPassword(token, data.password);
      setStep('success');
    } catch (error) {
      setStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
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

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '' };
    if (pwd.length < 8) return { label: 'Weak', color: 'text-red-500' };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { label: 'Weak', color: 'text-red-500' };
    if (score <= 2) return { label: 'Fair', color: 'text-yellow-500' };
    if (score <= 3) return { label: 'Good', color: 'text-blue-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const strength = getPasswordStrength(password);

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

          {step === 'form' && (
            <>
              <motion.div
                className="text-center mb-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your new password below.</p>
              </motion.div>

              <motion.form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                variants={itemVariants}
              >
                <motion.div variants={itemVariants}>
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Create a new password"
                    label="New Password"
                    icon={<Lock size={20} />}
                    error={errors.password?.message}
                  />
                  {password && (
                    <motion.p
                      className={`text-sm mt-1 ${strength.color}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      Password strength: {strength.label}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Confirm your new password"
                    label="Confirm Password"
                    icon={<Lock size={20} />}
                    error={errors.confirmPassword?.message}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isSubmitting}
                    className="flex items-center justify-center gap-2"
                  >
                    Reset Password <Lock size={20} />
                  </Button>
                </motion.div>
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
                Password Reset Successful
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-8 text-center"
                variants={itemVariants}
              >
                Your password has been successfully reset. You can now log in with your new password.
              </motion.p>

              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                <Link to="/login">
                  <Button fullWidth className="flex items-center justify-center gap-2">
                    Go to Login <Lock size={20} />
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {step === 'error' && (
            <>
              <motion.div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                variants={itemVariants}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <AlertCircle size={40} className="text-red-600" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-3 text-center"
                variants={itemVariants}
              >
                Reset Failed
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-8 text-center"
                variants={itemVariants}
              >
                {errorMessage || 'The reset link is invalid or has expired.'}
              </motion.p>

              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                <Link to="/forgot-password">
                  <Button fullWidth>
                    Request New Reset Link
                  </Button>
                </Link>
                <Link to="/login">
                  <Button fullWidth variant="secondary">
                    Back to Login
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