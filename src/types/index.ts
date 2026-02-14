// User Types
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'CAFE_OWNER' | 'CHEF' | 'WAITER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  profileCompleted: boolean;
  createdAt: Date;
}

export interface CustomerProfile extends User {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  address: {
    street: string;
    plotNo: string;
    city: string;
    pincode: string;
  };
  academicInfo: AcademicEntry[];
  workExperience?: WorkExperienceEntry[];
}

export interface AcademicEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  yearOfCompletion: number;
}

export interface WorkExperienceEntry {
  id: string;
  company: string;
  position: string;
  duration: {
    startDate: Date;
    endDate?: Date;
  };
  description: string;
}

// Café Types
export interface Cafe {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  totalReviews: number;
  cuisine: string;
  openingHours: {
    open: string;
    close: string;
  };
  ownerId: string;
}

export interface Table {
  id: string;
  cafeId: string;
  tableNumber: number;
  capacity: number;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface Booking {
  id: string;
  customerId: string;
  cafeId: string;
  tableId: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  numberOfPeople: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: Date;
}

// Menu Types
export interface MenuItem {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
}

export interface MenuCategory {
  id: string;
  cafeId: string;
  name: string;
  items: MenuItem[];
}

// Order Types
export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
}

export interface Order {
  id: string;
  bookingId: string;
  customerId: string;
  cafeId: string;
  items: OrderItem[];
  status: 'PLACED' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  totalAmount: number;
  orderDate: Date;
  updatedAt: Date;
  estimatedReadyTime?: Date;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  paymentMethod: 'ONLINE' | 'CASH';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  createdAt: Date;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
