
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Home, 
  Upload, 
  Database, 
  Settings, 
  LogOut,
  Users,
  PieChart,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          <h1 className="text-xl font-bold text-gray-900">PredictifyChurn</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          <Link to="/customers" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <Users className="w-4 h-4 mr-2" />
            Customers
          </Link>
          <Link to="/train-model" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <PieChart className="w-4 h-4 mr-2" />
            Train Model
          </Link>
          <Link to="/upload" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Link>
          <Link to="/datasets" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <Database className="w-4 h-4 mr-2" />
            Datasets
          </Link>
          <Link to="/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-sm font-medium text-gray-700">admin@example.com</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
