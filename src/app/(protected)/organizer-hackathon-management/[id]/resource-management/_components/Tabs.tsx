// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Tabs.tsx
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 200; // Adjust as needed

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const tabs = [
    { id: "round", label: "Rounds" },
    { id: "location", label: "Locations" },
    { id: "roundMarkCriteria", label: "Round Mark Criteria" },
    { id: "teamRequest", label: "Team Requests" },
    { id: "individualRequest", label: "Individual Registration Requests" },
    { id: "teamFormation", label: "Team Formation" },
    { id: "userManagement", label: "User Management" },
    { id: "assignJudgeToRound", label: "Assign Judge to Round" },
    { id: "judge", label: "Judge Assign" },
    { id: "submission", label: "Submissions" },
    { id: "notification", label: "Notifications" },
    { id: "hackathonResult", label: "Results" },
    { id: "feedback", label: "Feedback" },
    { id: "device", label: "Device Management" },
    { id: "sponsorship", label: "Sponsorship" },
  ];

  return (
    <div className="flex items-center mb-4">
      <button
        className="p-1 bg-white rounded-l shadow-sm hover:bg-gray-100 focus:outline-none"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide border-b flex-grow"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex space-x-4 whitespace-nowrap px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-3 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="p-1 bg-white rounded-r shadow-sm hover:bg-gray-100 focus:outline-none"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
