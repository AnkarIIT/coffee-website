import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'resend'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('resend');
        return;
      }

      try {
        await api.verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await api.resendVerificationEmail(email);
      setErrorMessage(null);
      setStatus('resend');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setIsResending(false);
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

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-coffee-50 to-orange-50">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader size={32} className="text-coffee-600" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h1>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
            className="text-center mb-8"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-coffee-600 mb-2">BREWLYN</h1>
          </motion.div>

          {status === 'success' && (
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
                Email Verified!
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-8 text-center"
                variants={itemVariants}
              >
                Your email has been successfully verified. You can now log in and start booking your favorite cafés.
              </motion.p>

              <motion.div variants={itemVariants}>
                <Link to="/login">
                  <Button fullWidth className="flex items-center justify-center gap-2">
                    Go to Login <Mail size={20} />
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {status === 'error' && (
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
                Verification Failed
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-4 text-center"
                variants={itemVariants}
              >
                {errorMessage || 'The verification link is invalid or has expired.'}
              </motion.p>

              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                {email && (
                  <Button fullWidth onClick={handleResendVerification} isLoading={isResending}>
                    Resend Verification Email
                  </Button>
                )}
                <Link to="/register">
                  <Button fullWidth variant="secondary">
                    Create New Account
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {status === 'resend' && (
            <>
              <motion.div
                className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6"
                variants={itemVariants}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <Mail size={40} className="text-coffee-600" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-3 text-center"
                variants={itemVariants}
              >
                Verify Your Email
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-8 text-center"
                variants={itemVariants}
              >
                We've sent a verification email to <strong>{email || 'your email address'}</strong>.
                Please check your inbox and click the verification link.
              </motion.p>

              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                {email && (
                  <Button fullWidth onClick={handleResendVerification} isLoading={isResending}>
                    Resend Verification Email
                  </Button>
                )}
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