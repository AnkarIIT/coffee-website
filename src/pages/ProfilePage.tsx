import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, Input } from '../components/common/Button';
import { useAuthStore } from '../store';
import { api } from '../services/api';
import type { User as UserType, CustomerProfile } from '../types';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  street: z.string().optional(),
  plotNo: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      const userData: ProfileFormData = {
        firstName: (user as CustomerProfile).firstName || '',
        lastName: (user as CustomerProfile).lastName || '',
        email: user.email,
        phone: '',
        dateOfBirth: (user as CustomerProfile).dob ? new Date((user as CustomerProfile).dob).toISOString().split('T')[0] : '',
        gender: (user as CustomerProfile).gender || '',
        street: (user as CustomerProfile).address?.street || '',
        plotNo: (user as CustomerProfile).address?.plotNo || '',
        city: (user as CustomerProfile).address?.city || '',
        pincode: (user as CustomerProfile).address?.pincode || '',
      };
      reset(userData);
      setIsEmailVerified(user.isEmailVerified);
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSaveStatus('idle');
    setSaveMessage(null);

    try {
      const updateData: Record<string, unknown> = {
        ...data,
        address: {
          street: data.street || '',
          plotNo: data.plotNo || '',
          city: data.city || '',
          pincode: data.pincode || '',
        },
      };

      updateData.firstName = data.firstName;
      updateData.lastName = data.lastName;
      updateData.dob = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;
      updateData.gender = data.gender || undefined;

      await updateProfile(updateData as Partial<UserType>);
      setSaveStatus('success');
      setSaveMessage('Profile updated successfully!');
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (_currentPassword: string, newPassword: string) => {
    try {
      await api.updateProfile({ password: newPassword } as any);
      setShowPasswordModal(false);
      setSaveStatus('success');
      setSaveMessage('Password changed successfully!');
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Not set';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors p-2" aria-label="Back to dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`} style={{ fontSize: '0.75rem' }}>
              {isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
            </span>
          </motion.div>
        </motion.div>

        {/* Save Status Toast */}
        <AnimatePresence>
          {saveStatus !== 'idle' && (
            <motion.div
              key={saveStatus}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${
                saveStatus === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {saveStatus === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{saveMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Basic Information */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <User size={24} className="text-coffee-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register('firstName')}
                label="First Name"
                placeholder="Enter your first name"
                error={errors.firstName?.message}
              />
              <Input
                {...register('lastName')}
                label="Last Name"
                placeholder="Enter your last name"
                error={errors.lastName?.message}
              />
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              error={errors.email?.message}
              disabled
              className="bg-gray-50"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register('phone')}
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                icon={<Phone size={20} />}
              />
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    className="input-field pl-10"
                  />
                </div>
                {errors.dateOfBirth && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.dateOfBirth.message}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-3.5 text-gray-400" />
                <select
                  {...register('gender')}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="">Select gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              {errors.gender && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.gender.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <MapPin size={24} className="text-coffee-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Address</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                {...register('street')}
                label="Street Address"
                placeholder="Enter your street address"
                icon={<MapPin size={20} />}
              />
              <Input
                {...register('plotNo')}
                label="Plot/House Number"
                placeholder="Enter plot/house number"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Input
                {...register('city')}
                label="City"
                placeholder="Enter your city"
              />
              <Input
                {...register('pincode')}
                label="PIN Code"
                placeholder="Enter PIN code"
                type="text"
              />
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-coffee-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-coffee-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                {!isEmailVerified && (
                  <Button variant="secondary" size="sm" onClick={() => api.resendVerificationEmail(user!.email)}>
                    Verify
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-coffee-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-coffee-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <Save size={24} className="text-coffee-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-coffee-100 rounded-lg flex items-center justify-center">
                    <Save size={18} className="text-coffee-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Save size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            className="flex justify-end gap-4 pt-4 border-t border-gray-200"
            variants={itemVariants}
          >
            <Link to="/dashboard">
              <Button variant="secondary" fullWidth={false}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              fullWidth={false}
              isLoading={isSaving || isSubmitting}
              className="flex items-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </Button>
          </motion.div>
        </motion.form>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowPasswordModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                <ChangePasswordForm onSubmit={handleChangePassword} onClose={() => setShowPasswordModal(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

interface ChangePasswordFormProps {
  onSubmit: (_currentPassword: string, newPassword: string) => Promise<void>;
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(currentPassword, newPassword);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        label="Current Password"
        placeholder="Enter current password"
        value={currentPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        label="New Password"
        placeholder="Enter new password (min 8 chars)"
        value={newPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        label="Confirm New Password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
        required
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  );
};