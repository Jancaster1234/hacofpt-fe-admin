// src/app/[locale]/(protected)/demo-add-data/_components/TabsComponent.tsx
"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsComponentProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabsComponent;
