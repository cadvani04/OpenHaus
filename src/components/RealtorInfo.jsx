import React from 'react';

const RealtorInfo = ({ realtor }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img 
            src={realtor.logo} 
            alt={`${realtor.company} logo`}
            className="h-12 w-auto rounded-lg bg-white p-2"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{realtor.name}</h1>
          <p className="text-blue-100 text-sm">{realtor.company}</p>
          <p className="text-blue-100 text-xs">License: {realtor.license}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-500">
        <div className="flex items-center space-x-2 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>{realtor.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>{realtor.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default RealtorInfo; 