import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [rememberMe, setRememberMe] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      navigate('/dashboard');
    } catch (error) {
      // Error handled by store
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
    <motion.form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
        <Input
          {...register('password')}
          type="password"
          placeholder="Enter your password"
          label="Password"
          icon={<Lock size={20} />}
          error={errors.password?.message}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-coffee-600 focus:ring-coffee-500"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-coffee-600 hover:underline">
          Forgot password?
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          className="flex items-center justify-center gap-2"
        >
          Login <ArrowRight size={20} />
        </Button>
      </motion.div>

      <motion.p variants={itemVariants} className="text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-coffee-600 font-semibold hover:underline">
          Sign up here
        </Link>
      </motion.p>
    </motion.form>
  );
};

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [terms, setTerms] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      navigate('/email-verification');
    } catch (error) {
      // Error handled by store
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
    <motion.form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Input
            {...register('firstName')}
            type="text"
            placeholder="First name"
            label="First Name"
            error={errors.firstName?.message}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Input
            {...register('lastName')}
            type="text"
            placeholder="Last name"
            label="Last Name"
            error={errors.lastName?.message}
          />
        </motion.div>
      </div>

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
        <Input
          {...register('password')}
          type="password"
          placeholder="Create a password"
          label="Password"
          icon={<Lock size={20} />}
          error={errors.password?.message}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirm your password"
          label="Confirm Password"
          icon={<Lock size={20} />}
          error={errors.confirmPassword?.message}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 rounded border-gray-300 text-coffee-600 focus:ring-coffee-500 mt-1"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{' '}
          <Link to="/terms" className="text-coffee-600 hover:underline">
            Terms of Service
          </Link>
        </label>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          className="flex items-center justify-center gap-2"
        >
          Create Account <ArrowRight size={20} />
        </Button>
      </motion.div>

      <motion.p variants={itemVariants} className="text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-coffee-600 font-semibold hover:underline">
          Login here
        </Link>
      </motion.p>
    </motion.form>
  );
};