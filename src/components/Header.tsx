import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Users, BarChart2, Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-white" />
            <h1 className="ml-2 text-2xl font-bold text-white">نظام تقييم الموظفين</h1>
          </div>
          
          <nav className="flex space-x-1 md:space-x-4">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-500 hover:text-white'}`
              }
            >
              <BarChart2 className="w-5 h-5 mr-1" />
              <span>لوحة المعلومات</span>
            </NavLink>
            
            <NavLink 
              to="/evaluate" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-500 hover:text-white'}`
              }
            >
              <Calendar className="w-5 h-5 mr-1" />
              <span>التقييم اليومي</span>
            </NavLink>
            
            <NavLink 
              to="/employees" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-500 hover:text-white'}`
              }
            >
              <Users className="w-5 h-5 mr-1" />
              <span>الموظفين</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;