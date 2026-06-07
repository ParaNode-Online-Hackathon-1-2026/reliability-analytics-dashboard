import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UploadedDataProvider } from './context/UploadedDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import VendorDetail from './pages/VendorDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';

// A wrapper component that provides the standard app layout (Sidebar + Header)
// only for authenticated routes.
function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Custom route to redirect authenticated users away from the login page
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/' : `/vendor/${user.vendorId}`} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <UploadedDataProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin']}>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/vendor/:id" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin', 'vendor']}>
                <AppLayout>
                  <VendorDetail />
                </AppLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin']}>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin', 'vendor']}>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />

          <Route path="/access-denied" element={
            <ProtectedRoute>
              <AppLayout>
                <AccessDenied />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </UploadedDataProvider>
    </AuthProvider>
  );
}

export default App;
