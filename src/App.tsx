
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import DatasetsPage from "./pages/DatasetsPage";
import CustomersPage from "./pages/CustomersPage";
import ModelTrainingPage from "./pages/ModelTrainingPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import ModelDetailsPage from "./pages/ModelDetailsPage";
import ModelsPage from "./pages/ModelsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Custom component to handle the redirect with proper typing
const ModelRedirect = () => {
  const location = useLocation();
  const newPath = `/models${location.pathname.substring(6)}`;
  return <Navigate to={newPath} replace />;
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/datasets" 
                element={
                  <ProtectedRoute>
                    <DatasetsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers" 
                element={
                  <ProtectedRoute>
                    <CustomersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/train-model" 
                element={
                  <ProtectedRoute>
                    <ModelTrainingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers/:id" 
                element={
                  <ProtectedRoute>
                    <CustomerDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/models" 
                element={
                  <ProtectedRoute>
                    <ModelsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/models/:id" 
                element={
                  <ProtectedRoute>
                    <ModelDetailsPage />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect from /model/:id to /models/:id */}
              <Route path="/train-model" element={<ModelRedirect />} />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
