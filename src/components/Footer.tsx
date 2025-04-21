import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="mt-auto bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">
            © {year} نظام تقييم الموظفين. جميع الحقوق محفوظة.
          </p>
          <div className="mt-2 md:mt-0">
            <a href="#" className="text-primary-600 hover:text-primary-500 mr-4">سياسة الخصوصية</a>
            <a href="#" className="text-primary-600 hover:text-primary-500">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;