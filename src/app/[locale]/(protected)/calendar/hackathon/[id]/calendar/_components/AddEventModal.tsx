// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/_components/AddEventModal.tsx
"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";
import { useTranslations } from "@/hooks/useTranslations";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  onAddEvent: (eventData: {
    name: string;
    startDate: string;
    endDate: string;
    eventLabel: string;
    description: string;
    location: string;
  }) => void;
}

const calendarsEvents: Record<string, ScheduleEventLabel> = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
};

const labelColorMap = {
  danger: "#dc3545",
  success: "#28a745",
  primary: "#007bff",
  warning: "#ffc107",
};

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
  onAddEvent,
}) => {
  const t = useTranslations("calendar");

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLabel, setEventLabel] = useState<ScheduleEventLabel>("primary");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetModalFields = () => {
    setEventName("");
    setEventDescription("");
    setEventLocation("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLabel("primary");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate event name
    if (!eventName.trim()) {
      newErrors.eventName = t("errors.nameRequired");
    }

    // Validate start date
    if (!eventStartDate) {
      newErrors.startDate = t("errors.startDateRequired");
    }

    // Validate end date is after start date
    if (
      eventStartDate &&
      eventEndDate &&
      new Date(eventEndDate) < new Date(eventStartDate)
    ) {
      newErrors.endDate = t("errors.endDateAfterStart");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onAddEvent({
      name: eventName,
      startDate: eventStartDate,
      endDate: eventEndDate || eventStartDate,
      eventLabel,
      description: eventDescription,
      location: eventLocation,
    });

    resetModalFields();
    onClose();
  };

  const colorNames = {
    danger: t("colors.danger"),
    success: t("colors.success"),
    primary: t("colors.primary"),
    warning: t("colors.warning"),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-4 sm:p-6 lg:p-10 transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-xl dark:text-white/90 lg:text-2xl transition-colors duration-300">
            {t("addEvent")}
          </h5>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
        >
          <div>
            <label
              htmlFor="event-name"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 transition-colors duration-300"
            >
              {t("eventName")}*
            </label>
            <input
              id="event-name"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={`dark:bg-gray-900 h-11 w-full rounded-lg border ${
                errors.eventName
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-300`}
              placeholder={t("enterEventName")}
              required
              aria-required="true"
              aria-invalid={errors.eventName ? "true" : "false"}
              aria-describedby={
                errors.eventName ? "event-name-error" : undefined
              }
            />
            {errors.eventName && (
              <p
                id="event-name-error"
                className="mt-1 text-sm text-red-500 dark:text-red-400"
              >
                {errors.eventName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="event-description"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 transition-colors duration-300"
            >
              {t("description")}
            </label>
            <textarea
              id="event-description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="dark:bg-gray-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-300"
              placeholder={t("enterEventDescription")}
              rows={3}
              aria-describedby="event-description-info"
            />
            <p
              id="event-description-info"
              className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              {t("descriptionInfo")}
            </p>
          </div>

          <div>
            <label
              htmlFor="event-location"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 transition-colors duration-300"
            >
              {t("location")}
            </label>
            <input
              id="event-location"
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-300"
              placeholder={t("enterEventLocation")}
              aria-describedby="event-location-info"
            />
          </div>

          <div>
            <fieldset>
              <legend className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400 transition-colors duration-300">
                {t("eventColor")}
              </legend>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400 cursor-pointer transition-colors duration-300"
                        htmlFor={`modal-${value}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-label"
                            value={value}
                            id={`modal-${value}`}
                            checked={eventLabel === value}
                            onChange={() => setEventLabel(value)}
                            aria-labelledby={`color-label-${value}`}
                          />
                          <span
                            className={`flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700 transition-colors duration-300`}
                            style={{
                              backgroundColor:
                                eventLabel === value
                                  ? labelColorMap[value]
                                  : "transparent",
                            }}
                            aria-hidden="true"
                          >
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${
                                eventLabel === value ? "block" : "hidden"
                              }`}
                            ></span>
                          </span>
                        </span>
                        <span id={`color-label-${value}`}>
                          {colorNames[value as keyof typeof colorNames] || key}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div>
            <label
              htmlFor="event-start-date"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 transition-colors duration-300"
            >
              {t("startDateTime")}*
            </label>
            <div className="relative">
              <input
                id="event-start-date"
                type="datetime-local"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className={`dark:bg-gray-900 h-11 w-full appearance-none rounded-lg border ${
                  errors.startDate
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-300`}
                required
                aria-required="true"
                aria-invalid={errors.startDate ? "true" : "false"}
                aria-describedby={
                  errors.startDate ? "start-date-error" : undefined
                }
              />
              {errors.startDate && (
                <p
                  id="start-date-error"
                  className="mt-1 text-sm text-red-500 dark:text-red-400"
                >
                  {errors.startDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="event-end-date"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 transition-colors duration-300"
            >
              {t("endDateTime")}
            </label>
            <div className="relative">
              <input
                id="event-end-date"
                type="datetime-local"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className={`dark:bg-gray-900 h-11 w-full appearance-none rounded-lg border ${
                  errors.endDate
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-300`}
                aria-invalid={errors.endDate ? "true" : "false"}
                aria-describedby={errors.endDate ? "end-date-error" : undefined}
              />
              {errors.endDate && (
                <p
                  id="end-date-error"
                  className="mt-1 text-sm text-red-500 dark:text-red-400"
                >
                  {errors.endDate}
                </p>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("endDateInfo")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={() => {
                resetModalFields();
                onClose();
              }}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors duration-300"
              aria-label={t("cancel")}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label={t("addEvent")}
            >
              {t("addEvent")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEventModal;
