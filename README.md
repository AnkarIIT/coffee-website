# BREWLYN - Coffee Ordering Platform Frontend

Professional, animated web-based frontend for a multi-café coffee ordering and management platform built with React, TypeScript, Vite, and Framer Motion.

## 🎨 Features

### User Experience
- **Smooth Animations** - Framer Motion animations throughout the app
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Modern UI** - Coffee-themed color scheme with professional gradients
- **Role-Based Interface** - Different interfaces for customers, admins, café owners, chefs, and waiters

### Core Features
- **Authentication** - Login and registration with email verification
- **Café Browsing** - Discover and filter cafés
- **Table Booking** - Reserve tables for specific dates and times
- **Menu Ordering** - Pre-order food with real-time pricing
- **Order Tracking** - Real-time status updates from placement to serving
- **User Profiles** - Complete profile management with validation
- **Payment Integration Ready** - UI components for payment processing

## 🚀 Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📋 Project Structure

```
src/
├── components/
│   ├── common/              # Shared UI components
│   ├── auth/                # Auth forms
│   └── customer/            # Customer components
├── pages/                   # Page components
├── store/                   # State management
├── types/                   # TypeScript definitions
├── utils/                   # Utility functions
├── hooks/                   # Custom hooks
├── App.tsx                  # Main app
└── index.css               # Global styles
```

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Server runs at: `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Key Components

- **Button** - Animated button variants
- **Input** - Form inputs with validation
- **Card** - Hover-effect cards
- **Navigation** - Responsive navbar
- **Authentication Forms** - Login/Register

## 🔐 Authentication

- Email/password registration
- Email verification required
- Login flow with JWT (ready for API)
- Protected routes
- Profile completion requirement

## 🎨 Styling

- Coffee-themed color palette
- TailwindCSS utilities
- Smooth animations
- Gradient backgrounds
- Mobile-first responsive design

## 🔄 State Management

Three Zustand stores:
- **useAuthStore** - Authentication
- **useUiStore** - UI state and modals
- **useCafeSelectionStore** - Café selection

## ✨ Animated Components

All components feature smooth Framer Motion animations:
- Entry animations
- Hover effects
- Transition animations
- Page transitions
- Modal animations

## 📝 Next Steps

1. API Integration with backend
2. Build additional pages (cafés list, booking, dashboard)
3. Add payment UI integration
4. Implement real-time features (WebSocket)
5. User testing and refinement

## 🌐 Deployment

### Vercel
```bash
npm add -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Zustand](https://github.com/pmndrs/zustand)

## 🎉 What's Included

✅ Professional UI components with animations
✅ Complete authentication flow
✅ Type-safe TypeScript codebase
✅ Responsive mobile-first design
✅ Modern styling with TailwindCSS
✅ Smooth Framer Motion animations
✅ Form validation with React Hook Form
✅ State management with Zustand
✅ Clean project structure
✅ Production-ready build

---

Built with ❤️ for amazing café experiences
