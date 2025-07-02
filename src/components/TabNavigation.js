// components/TabNavigation.js

import React from 'react';

const tabs = [
  { key: 'available', label: 'AVAILABLE' },
  { key: 'booked', label: 'BOOKED' },
  { key: 'partial', label: 'PARTIAL' },
  { key: 'finish', label: 'FINISH' },
  { key: 'all', label: 'ALL' }
];

export const TabNavigation = ({ activeTab, onTabChange, counts }) => {
  return (
    <nav className="bg-white border-t border-gray-200">
      <ul className="flex justify-around text-sm text-gray-600">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={`flex-1 text-center py-3 cursor-pointer transition ${
              activeTab === tab.key ? 'text-blue-600 font-bold border-t-2 border-blue-600' : 'hover:text-gray-800'
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            {counts?.[tab.key] !== undefined && (
              <span className="ml-1 text-xs text-gray-500">({counts[tab.key]})</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};