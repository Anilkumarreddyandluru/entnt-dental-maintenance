
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import PatientManagement from "./components/PatientManagement";
import AppointmentManagement from "./components/AppointmentManagement";
import CalendarView from "./components/CalendarView";
import PatientDashboard from "./components/PatientDashboard";
import PatientAppointments from "./components/PatientAppointments";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'Admin' | 'Patient' }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'Admin' ? '/dashboard' : '/patient-dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Admin Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients"
          element={
            <ProtectedRoute requiredRole="Admin">
              <PatientManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AppointmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="calendar"
          element={
            <ProtectedRoute requiredRole="Admin">
              <CalendarView />
            </ProtectedRoute>
          }
        />
        
        {/* Patient Routes */}
        <Route
          path="patient-dashboard"
          element={
            <ProtectedRoute requiredRole="Patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-appointments"
          element={
            <ProtectedRoute requiredRole="Patient">
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
