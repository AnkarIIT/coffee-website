import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '../components/common';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, XCircle, ChevronLeft, ChevronRight, Utensils, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getUserOrders();
      setOrders(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'PLACED':
        return { icon: Package, color: 'bg-blue-100 text-blue-700', label: 'Order Placed' };
      case 'PREPARING':
        return { icon: Utensils, color: 'bg-yellow-100 text-yellow-700', label: 'Preparing' };
      case 'READY':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Ready for Pickup' };
      case 'SERVED':
        return { icon: CheckCircle, color: 'bg-purple-100 text-purple-700', label: 'Served' };
      case 'CANCELLED':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' };
      default:
        return { icon: Package, color: 'bg-gray-100 text-gray-700', label: status };
    }
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

  const StatusIcon: React.FC<{ status: Order['status']; size?: number }> = ({ status, size = 16 }) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return <Icon size={size} className={config.color.replace('bg-', 'text-')} />;
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
            <h1 className="section-title">Order History</h1>
            <p className="section-subtitle">Track all your past and current orders</p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={fetchOrders} className="ml-auto">
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
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order, _index) => (
              <motion.div key={order.id} variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-coffee-100 rounded-xl flex items-center justify-center">
                        <Package size={28} className="text-coffee-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                          <Badge variant={order.status === 'SERVED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}>
                            {getStatusConfig(order.status).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Café</p>
                        <p className="font-medium text-gray-900">{order.cafeId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center gap-2">
                          <StatusIcon status={order.status} size={16} />
                          <span className="font-medium text-gray-900">{getStatusConfig(order.status).label}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium text-gray-900 capitalize">Online</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'READY' && (
                        <Button size="sm" className="flex items-center gap-2">
                          <CheckCircle size={16} />
                          Mark as Picked Up
                        </Button>
                      )}
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
                <Package size={40} className="text-coffee-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start exploring cafés!</p>
              <Link to="/cafes">
                <Button className="flex items-center gap-2 mx-auto">
                  <Package size={20} />
                  Browse Cafés
                </Button>
              </Link>
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