import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Users, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, ChevronLeft, MapPin, Star } from 'lucide-react';
import { Button, Card } from '../components/common/Button';
import { useAuthStore, useCafeSelectionStore } from '../store';
import { api } from '../services/api';
import type { Cafe } from '../types';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { selectedCafeId, selectedBookingDate, selectedTable, selectedTime, numberOfPeople, setSelectedBookingDate, setSelectedTable, setSelectedTime, setNumberOfPeople, clearSelection } = useCafeSelectionStore();

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [tables, setTables] = useState<{ id: string; number: number; capacity: number; isAvailable: boolean }[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDateState] = useState<Date | null>(selectedBookingDate);

  // Generate time slots (e.g., 9:00 AM to 9:00 PM every 30 min)
  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 9; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    setTimeSlots(slots);
  }, []);

  useEffect(() => {
    const fetchCafe = async () => {
      if (!selectedCafeId) {
        navigate('/cafes');
        return;
      }
      setIsLoading(true);
      try {
        const cafeData = await api.getCafeById(selectedCafeId);
        setCafe(cafeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load café');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCafe();
  }, [selectedCafeId, navigate]);

  useEffect(() => {
    if (selectedBookingDate && selectedCafeId) {
      fetchTables();
    }
  }, [selectedBookingDate, selectedCafeId]);

  const fetchTables = async () => {
    if (!selectedBookingDate || !selectedCafeId) return;
    try {
      const dateStr = selectedBookingDate.toISOString().split('T')[0];
      const tablesData = await api.getTables(selectedCafeId, dateStr);
      setTables(tablesData);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDateState(date);
    setSelectedBookingDate(date);
    setSelectedTable(null);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBooking = async () => {
    if (!selectedCafeId || !selectedTable || !selectedTime || !selectedBookingDate) return;

    setIsBooking(true);
    setError(null);

    try {
      const dateStr = selectedBookingDate.toISOString().split('T')[0];
      await api.createBooking({
        cafeId: selectedCafeId,
        tableId: selectedTable,
        date: dateStr,
        time: selectedTime,
        duration: 90,
        numberOfPeople,
      });
      clearSelection();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    } else {
      navigate('/cafes');
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-orange-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-coffee-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In to Book</h1>
          <p className="text-gray-600 mb-6">Please log in or create an account to reserve a table.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="secondary" className="flex items-center gap-2">
                <ArrowLeft size={20} />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="flex items-center gap-2">
                Sign Up <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading || !cafe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl" />
            <div className="bg-white p-6 rounded-xl" />
            <div className="bg-white p-6 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Progress Steps */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= s ? 'bg-coffee-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={{ scale: step === s ? 1.1 : 1 }}
                >
                  {step > s ? <CheckCircle size={16} /> : s}
                </motion.div>
                {s < 4 && (
                  <motion.div
                    className={`w-20 h-1 mx-2 transition-all duration-300 ${step > s ? 'bg-coffee-600' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className="w-10 text-center">Date</span>
            <span className="w-20 text-center">Table</span>
            <span className="w-20 text-center">Time</span>
            <span className="w-10 text-center">Confirm</span>
          </div>
        </motion.div>

        {/* Café Info */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-20 h-20 bg-coffee-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">{cafe.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1"><MapPin size={14} /> {cafe.location}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {cafe.openingHours.open} - {cafe.openingHours.close}</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {cafe.rating}</span>
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            variants={containerVariants}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            {/* Step 1: Select Date */}
            {step === 1 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Select Date</h3>
                    <p className="text-gray-500 mt-1">Choose a date for your reservation</p>
                  </div>
                  <Link to="/cafes" onClick={(e) => { e.preventDefault(); navigate('/cafes'); }}>
                    <Button variant="secondary" size="sm">
                      <ArrowLeft size={16} />
                      Change Café
                    </Button>
                  </Link>
                </div>

                {/* Calendar */}
                <div className="space-y-4">
                  {[0, 1, 2].map((monthOffset) => {
                    const date = new Date(today);
                    date.setMonth(date.getMonth() + monthOffset);
                    return (
                      <div key={monthOffset} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                        </div>
                        <div className="grid grid-cols-7 gap-1 p-3">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                          ))}
                          {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, i) => {
                            const day = i + 1;
                            const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
                            const isPast = cellDate < today;
                            const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();
                            const isToday = cellDate.toDateString() === today.toDateString();

                            return (
                              <motion.button
                                key={day}
                                onClick={() => !isPast && handleDateSelect(cellDate)}
                                disabled={isPast}
                                className={`h-10 w-full rounded-lg text-sm font-medium transition-all ${
                                  isPast
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-coffee-600 text-white shadow-md'
                                    : isToday
                                    ? 'text-coffee-600 font-bold ring-2 ring-coffee-200'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: day * 0.01 }}
                              >
                                {day}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 2: Select Table */}
            {step === 2 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Select Table</h3>
                    <p className="text-gray-500 mt-1">{selectedDate ? formatDate(selectedDate) : 'Choose a date first'}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={goBack}>
                    <ChevronLeft size={16} />
                    Back
                  </Button>
                </div>

                {tables.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 text-coffee-200" />
                    <p>No tables available for this date. Please select another date.</p>
                    <Button variant="secondary" onClick={goBack} className="mt-4">
                      <ChevronLeft size={16} />
                      Change Date
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tables.map((table) => (
                      <motion.button
                        key={table.id}
                        onClick={() => table.isAvailable && handleTableSelect(table.id)}
                        disabled={!table.isAvailable}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          table.isAvailable
                            ? selectedTable === table.id
                              ? 'border-coffee-600 bg-coffee-50 shadow-lg'
                              : 'border-gray-200 hover:border-coffee-300 hover:bg-gray-50'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: table.number * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">Table {table.number}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            table.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {table.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <span className="flex items-center gap-1"><Users size={14} /> {table.capacity} people</span>
                        </div>
                        {selectedTable === table.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 text-sm text-coffee-600 font-medium flex items-center gap-1"
                          >
                            <CheckCircle size={14} /> Selected
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 3: Select Time */}
            {step === 3 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Select Time</h3>
                    <p className="text-gray-500 mt-1">Table {tables.find(t => t.id === selectedTable)?.number} • {selectedDate ? formatDate(selectedDate) : ''}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={goBack}>
                    <ChevronLeft size={16} />
                    Back
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input type="number" min="1" max="10" value={numberOfPeople} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumberOfPeople(parseInt(e.target.value))} className="w-16 input-field text-center" />
                      <span className="text-sm text-gray-600">Guests</span>
                    </label>
                    <Users size={20} className="text-coffee-600" />
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-coffee-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: timeSlots.indexOf(time) * 0.02 }}
                      >
                        {formatTime(time)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Confirm Booking */}
            {step === 4 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
                    <p className="text-gray-500 mt-1">Review your reservation details</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={goBack}>
                    <ChevronLeft size={16} />
                    Back
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Café</span>
                        <span className="font-medium">{cafe.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{selectedDate ? formatDate(selectedDate) : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">{selectedTime ? formatTime(selectedTime) : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Table</span>
                        <span className="font-medium">Table {tables.find(t => t.id === selectedTable)?.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests</span>
                        <span className="font-medium">{numberOfPeople}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">90 minutes</span>
                      </div>
                    </div>
                  </Card>

                  {error && (
                    <motion.div
                      className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" fullWidth onClick={goBack}>
                      <ChevronLeft size={16} />
                      Back
                    </Button>
                    <Button
                      fullWidth
                      isLoading={isBooking}
                      onClick={handleBooking}
                      className="flex items-center justify-center gap-2"
                    >
                      Confirm Booking <ArrowRight size={20} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};