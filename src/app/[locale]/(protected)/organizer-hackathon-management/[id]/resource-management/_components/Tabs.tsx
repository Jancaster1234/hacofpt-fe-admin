// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Tabs.tsx
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useRouter, useSearchParams } from "next/navigation";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

// Tab groups for organization
const TAB_GROUPS = [
  [
    "round",
    "location",
    "roundMarkCriteria",
    "teamRequest",
    "individualRequest",
    "teamFormation",
  ],
  [
    "userManagement",
    "assignJudgeToRound",
    "judge",
    "submission",
    "notification",
    "hackathonResult",
  ],
  ["feedback", "device", "sponsorship"],
];

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const t = useTranslations("resourceManagement.tabs");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if scroll arrows should be shown
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();

      // Check on window resize
      window.addEventListener("resize", checkScrollPosition);

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = window.innerWidth < 640 ? 150 : 200; // Smaller scroll on mobile

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }

      // Re-check scroll position after scrolling
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Handle tab click with URL update
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);

    // Update URL with the selected tab
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Define tabs with their translations
  const getAllTabs = () => [
    { id: "round", label: t("round") },
    { id: "location", label: t("location") },
    { id: "roundMarkCriteria", label: t("roundMarkCriteria") },
    { id: "teamRequest", label: t("teamRequest") },
    { id: "individualRequest", label: t("individualRequest") },
    { id: "teamFormation", label: t("teamFormation") },
    { id: "userManagement", label: t("userManagement") },
    { id: "assignJudgeToRound", label: t("assignJudgeToRound") },
    { id: "judge", label: t("judge") },
    { id: "submission", label: t("submission") },
    { id: "notification", label: t("notification") },
    { id: "hackathonResult", label: t("hackathonResult") },
    { id: "feedback", label: t("feedback") },
    { id: "device", label: t("device") },
    { id: "sponsorship", label: t("sponsorship") },
  ];

  // Create grouped tab arrays
  const createTabGroups = () => {
    const allTabs = getAllTabs();

    return TAB_GROUPS.map((group) =>
      group
        .map((tabId) => allTabs.find((tab) => tab.id === tabId))
        .filter(Boolean)
    );
  };

  const tabGroups = createTabGroups();

  // Render a single tab button
  const renderTabButton = (tab: { id: string; label: string }) => (
    <button
      key={tab.id}
      className={`py-2 px-2 md:px-3 transition-all duration-200 whitespace-nowrap text-sm md:text-base 
        focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 rounded
        ${
          activeTab === tab.id
            ? "bg-blue-100 dark:bg-blue-900 border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      onClick={() => handleTabClick(tab.id)}
      aria-selected={activeTab === tab.id}
      role="tab"
    >
      {tab.label}
    </button>
  );

  return (
    <div className="space-y-2">
      {tabGroups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="flex items-center">
          {showLeftArrow && (
            <button
              className="p-1 bg-white dark:bg-gray-800 rounded-l shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200 flex-shrink-0"
              onClick={() => scroll("left")}
              aria-label={t("scrollLeft")}
            >
              <ChevronLeft
                className="text-gray-600 dark:text-gray-300"
                size={20}
              />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700 flex-grow transition-colors duration-200"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex space-x-2 md:space-x-4 whitespace-nowrap px-2">
              {group.map((tab) => tab && renderTabButton(tab))}
            </div>
          </div>

          {showRightArrow && (
            <button
              className="p-1 bg-white dark:bg-gray-800 rounded-r shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200 flex-shrink-0"
              onClick={() => scroll("right")}
              aria-label={t("scrollRight")}
            >
              <ChevronRight
                className="text-gray-600 dark:text-gray-300"
                size={20}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
