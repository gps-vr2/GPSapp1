// components/Header.js

import React from 'react';

export const Header = ({ title = 'PropertyScope', onRefresh }) => {
  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <button
        onClick={onRefresh}
        className="text-sm text-blue-600 hover:underline"
      >
        Refresh
      </button>
    </header>
  );
};