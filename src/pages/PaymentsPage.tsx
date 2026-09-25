import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '../components/common';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, Loader, Download, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { Payment } from '../types';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getPaymentHistory();
      setPayments(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusConfig = (status: Payment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Completed' };
      case 'PENDING':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' };
      case 'FAILED':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Failed' };
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  const getMethodIcon = (method: Payment['paymentMethod']) => {
    return method === 'ONLINE' ? <CreditCard size={20} /> : <DollarSign size={20} />;
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-xl w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalSpent = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="section-title">Payment History</h1>
            <p className="section-subtitle">View all your transactions and receipts</p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-coffee-100 rounded-xl flex items-center justify-center">
                <CreditCard size={24} className="text-coffee-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={fetchPayments} className="ml-auto">
              Retry
            </Button>
          </motion.div>
        )}

        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paginatedPayments.length > 0 ? (
            paginatedPayments.map((payment, _index) => (
              <motion.div key={payment.id} variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-coffee-100 rounded-xl flex items-center justify-center">
                        {getMethodIcon(payment.paymentMethod)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {payment.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash Payment'}
                          </h3>
                          <Badge
                            variant={
                              payment.status === 'COMPLETED' ? 'success' :
                              payment.status === 'PENDING' ? 'warning' : 'danger'
                            }
                          >
                            {getStatusConfig(payment.status).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Order #{payment.orderId.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-900">{payment.transactionId || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Method</p>
                        <p className="font-medium text-gray-900 capitalize">{payment.paymentMethod.toLowerCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order</p>
                        <p className="font-medium text-gray-900">#{payment.orderId.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <Download size={16} />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-16"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard size={40} className="text-coffee-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any payments yet. Your payment history will appear here.</p>
              <Button variant="secondary" onClick={fetchPayments}>
                <Loader size={16} className="mr-2 animate-spin" />
                Refresh
              </Button>
            </motion.div>
          )}
        </motion.div>

        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};