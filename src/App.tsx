import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from './components/common/Navigation';
import { HomePage, LoginPage, RegisterPage, DashboardPage, CaféListPage } from './pages';
import { useAuthStore } from './store';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50">
        <Navigation />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cafes"
              element={
                <ProtectedRoute>
                  <CaféListPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
