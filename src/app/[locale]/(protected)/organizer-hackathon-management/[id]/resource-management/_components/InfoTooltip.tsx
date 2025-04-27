// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/InfoTooltip.tsx
import { useState } from "react";
import { InfoIcon } from "lucide-react";

interface InfoTooltipProps {
  title: string;
  content: string;
}

export function InfoTooltip({ title, content }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <InfoIcon
        size={16}
        className="text-gray-400 cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 text-sm bg-white border rounded-md shadow-md -left-2 -top-2 transform -translate-y-full">
          <div className="font-semibold text-gray-800 mb-1">{title}</div>
          <div className="text-gray-600">{content}</div>
        </div>
      )}
    </div>
  );
}
