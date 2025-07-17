import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { key: 'available', label: 'Available' },
    { key: 'booked', label: 'Booked' },
    { key: 'partial', label: 'Partial' },
    { key: 'finish', label: 'Finished' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="bg-white border-t px-2 pt-3 pb-2 flex justify-center flex-wrap gap-2 text-xs md:text-base">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={`cursor-pointer px-3 py-1 rounded transition ${
            activeTab === tab.key
              ? 'bg-blue-100 text-blue-600 font-semibold'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label} ({counts[tab.key]})
          
        </div>
      ))}
    </div>
  );
};

export default TabNavigation;