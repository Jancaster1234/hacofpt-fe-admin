// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/_components/event/EventInformationSection.tsx
import React from "react";
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";
import { useTranslations } from "@/hooks/useTranslations";

interface EventInformationSectionProps {
  eventName: string;
  setEventName: (value: string) => void;
  eventDescription: string;
  setEventDescription: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  eventLabel: ScheduleEventLabel;
  setEventLabel: (value: ScheduleEventLabel) => void;
  eventStartDate: string;
  setEventStartDate: (value: string) => void;
  eventEndDate: string;
  setEventEndDate: (value: string) => void;
}

const calendarsEvents: Record<string, ScheduleEventLabel> = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
};

// Define color codes for each label
const labelColorMap = {
  danger: "#dc3545",
  success: "#28a745",
  primary: "#007bff",
  warning: "#ffc107",
};

const EventInformationSection: React.FC<EventInformationSectionProps> = ({
  eventName,
  setEventName,
  eventDescription,
  setEventDescription,
  eventLocation,
  setEventLocation,
  eventLabel,
  setEventLabel,
  eventStartDate,
  setEventStartDate,
  eventEndDate,
  setEventEndDate,
}) => {
  const t = useTranslations("calendar.event");

  return (
    <div className="space-y-4 sm:space-y-6 transition-colors duration-300">
      <div>
        <label
          htmlFor="event-name"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t("eventName")}
        </label>
        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder={t("enterEventName")}
          className="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-200"
          aria-required="true"
        />
      </div>

      <div>
        <label
          htmlFor="event-description"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t("description")}
        </label>
        <textarea
          id="event-description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          rows={3}
          placeholder={t("enterEventDescription")}
          className="dark:bg-gray-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="event-location"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t("location")}
        </label>
        <input
          id="event-location"
          type="text"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
          placeholder={t("enterEventLocation")}
          className="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block mb-3 sm:mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("eventColor")}
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {Object.entries(calendarsEvents).map(([key, value]) => (
            <div key={key} className="n-chk">
              <div
                className={`form-check form-check-${value} form-check-inline`}
              >
                <label
                  className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
                  htmlFor={`modal-${key}`}
                >
                  <span className="relative">
                    <input
                      className="sr-only form-check-input"
                      type="radio"
                      name="event-label"
                      value={value}
                      id={`modal-${key}`}
                      checked={eventLabel === value}
                      onChange={() => setEventLabel(value)}
                      aria-label={t(`colorLabels.${key.toLowerCase()}`)}
                    />
                    <span
                      className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700 transition-colors duration-200"
                      style={{
                        backgroundColor:
                          eventLabel === value
                            ? labelColorMap[value]
                            : "transparent",
                      }}
                    >
                      <span
                        className={`h-2 w-2 rounded-full bg-white ${
                          eventLabel === value ? "block" : "hidden"
                        }`}
                      ></span>
                    </span>
                  </span>
                  {t(`colorLabels.${key.toLowerCase()}`)}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label
            htmlFor="event-start-date"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("startDateTime")}
          </label>
          <div className="relative">
            <input
              id="event-start-date"
              type="datetime-local"
              value={eventStartDate}
              onChange={(e) => setEventStartDate(e.target.value)}
              className="dark:bg-gray-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-200"
              aria-required="true"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="event-end-date"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("endDateTime")}
          </label>
          <div className="relative">
            <input
              id="event-end-date"
              type="datetime-local"
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
              className="dark:bg-gray-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-200"
              aria-required="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInformationSection;
