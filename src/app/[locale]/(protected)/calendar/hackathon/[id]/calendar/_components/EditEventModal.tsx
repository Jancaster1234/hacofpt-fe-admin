// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/_components/EditEventModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { CalendarEvent } from "./Calendar";
import { useAuth } from "@/hooks/useAuth_v0";
import { User } from "@/types/entities/user";
import { FileUrl } from "@/types/entities/fileUrl";
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";
import EventInformationSection from "./event/EventInformationSection";
import EventFilesSection from "./event/EventFilesSection";
import EventAttendeesSection from "./event/EventAttendeesSection";
import EventRemindersSection from "./event/EventRemindersSection";
import { scheduleEventService } from "@/services/scheduleEvent.service";
import { fileUrlService } from "@/services/fileUrl.service";
import { scheduleEventReminderService } from "@/services/scheduleEventReminder.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent;
  onUpdateEvent: (eventData: {
    name: string;
    startDate: string;
    endDate: string;
    eventLabel: ScheduleEventLabel;
    description: string;
    location: string;
    files: FileUrl[];
    attendees: ScheduleEventAttendee[];
    reminders: ScheduleEventReminder[];
  }) => void;
  onDeleteEvent: (eventId: string) => void;
  teamMembers: User[];
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  onUpdateEvent,
  onDeleteEvent,
  teamMembers,
}) => {
  const { user } = useAuth();
  const t = useTranslations("calendar");
  const toast = useToast();

  // Event basic information
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLabel, setEventLabel] = useState<ScheduleEventLabel>("primary");
  const [scheduleId, setScheduleId] = useState<string>("");

  // Event additional data
  const [files, setFiles] = useState<FileUrl[]>([]);
  const [attendees, setAttendees] = useState<ScheduleEventAttendee[]>([]);
  const [reminders, setReminders] = useState<ScheduleEventReminder[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Current tab
  const [activeTab, setActiveTab] = useState("information");

  // Load event files
  const loadEventFiles = async () => {
    if (!selectedEvent?.id) return;

    try {
      const { data } = await fileUrlService.getFileUrlsByScheduleEventId(
        selectedEvent.id
      );
      setFiles(data);
    } catch (error) {
      console.error("Failed to load event files", error);
    }
  };

  const loadEventReminders = async () => {
    if (!selectedEvent?.id) return;

    try {
      const { data } =
        await scheduleEventReminderService.getScheduleEventRemindersByScheduleEventId(
          selectedEvent.id
        );
      setReminders(data);
    } catch (error) {
      console.error("Failed to load event reminders", error);
    }
  };

  useEffect(() => {
    // Populate modal fields when selectedEvent changes and modal is open
    if (isOpen && selectedEvent) {
      // Basic event info
      setEventName(selectedEvent.title || "");

      // Convert Date objects to datetime-local input format (YYYY-MM-DDThh:mm)
      const formatDateTime = (date: Date | string | undefined) => {
        if (!date) return "";
        const d = date instanceof Date ? date : new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      };

      setEventStartDate(formatDateTime(selectedEvent.start));
      setEventEndDate(formatDateTime(selectedEvent.end));

      // Map calendar value to eventLabel
      const calendarValue = selectedEvent.extendedProps?.calendar || "primary";
      setEventLabel(calendarValue as ScheduleEventLabel);

      // Additional event info from extendedProps
      setEventDescription(selectedEvent.extendedProps?.description || "");
      setEventLocation(selectedEvent.extendedProps?.location || "");

      // Set schedule ID
      setScheduleId(selectedEvent.extendedProps?.scheduleId || "");

      // Load event files via API
      loadEventFiles();

      // Load event reminders via API
      loadEventReminders();

      // The attendees will be loaded by the EventAttendeesSection component
      // So we don't need to call loadEventAttendees here
    }
  }, [selectedEvent, isOpen]);

  const handleSubmit = async () => {
    if (!selectedEvent?.id || !scheduleId) {
      toast.error(t("errors.missingIds"));
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Update the basic event information
      const { data: updatedEvent, message } =
        await scheduleEventService.updateScheduleEventInformation(
          selectedEvent.id,
          {
            scheduleId: scheduleId,
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            startTime: eventStartDate,
            endTime: eventEndDate || eventStartDate,
            eventLabel: eventLabel?.toUpperCase() as any,
            isRecurring: false,
            recurrenceRule: undefined,
          }
        );

      // Step 2: Handle the file associations if there are new files that need to be associated
      // Note: This step is now handled directly in the EventFilesSection component
      // when files are uploaded, so we don't need to do it again here

      // Update UI via the callback
      onUpdateEvent({
        name: eventName,
        startDate: eventStartDate,
        endDate: eventEndDate || eventStartDate,
        eventLabel: eventLabel,
        description: eventDescription,
        location: eventLocation,
        files: files,
        attendees: attendees,
        reminders: reminders,
      });

      toast.success(t("toasts.eventUpdated"));
      onClose();
    } catch (error: any) {
      toast.error(error.message || t("errors.updateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Tab navigation
  const tabs = [
    { id: "information", label: t("tabs.information") },
    { id: "attendees", label: t("tabs.attendees") },
    { id: "files", label: t("tabs.files") },
    { id: "reminders", label: t("tabs.reminders") },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-4 sm:p-6 lg:p-10 w-full mx-4 sm:mx-auto transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col px-1 sm:px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-lg sm:text-xl lg:text-2xl dark:text-white/90 transition-colors duration-300">
            {t("editEvent.title")}
          </h5>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {t("editEvent.subtitle")}
          </p>
        </div>

        {/* Tab Navigation - Scrollable on mobile */}
        <div className="flex overflow-x-auto space-x-1 mt-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-brand-500 border-b-2 border-brand-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 transition-all duration-300">
          {activeTab === "information" && (
            <EventInformationSection
              eventName={eventName}
              setEventName={setEventName}
              eventDescription={eventDescription}
              setEventDescription={setEventDescription}
              eventLocation={eventLocation}
              setEventLocation={setEventLocation}
              eventLabel={eventLabel}
              setEventLabel={setEventLabel}
              eventStartDate={eventStartDate}
              setEventStartDate={setEventStartDate}
              eventEndDate={eventEndDate}
              setEventEndDate={setEventEndDate}
            />
          )}

          {activeTab === "attendees" && (
            <EventAttendeesSection
              attendees={attendees}
              setAttendees={setAttendees}
              teamMembers={teamMembers}
              scheduleEventId={selectedEvent?.id}
            />
          )}

          {activeTab === "files" && (
            <EventFilesSection
              files={files}
              setFiles={setFiles}
              scheduleEventId={selectedEvent?.id}
            />
          )}

          {activeTab === "reminders" && (
            <EventRemindersSection
              reminders={reminders}
              setReminders={setReminders}
              scheduleEventId={selectedEvent?.id}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 modal-footer sm:justify-between">
          <button
            onClick={() => onDeleteEvent(selectedEvent.id as string)}
            type="button"
            className="w-full sm:w-auto flex justify-center items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors duration-300"
            disabled={isLoading}
            aria-label={t("buttons.deleteEvent")}
          >
            Delete Event
          </button>
          <div className="flex gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 sm:flex-none justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] transition-colors duration-300"
              disabled={isLoading}
              aria-label={t("buttons.cancel")}
            >
              {t("buttons.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="flex-1 sm:flex-none btn btn-success btn-update-event flex justify-center items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors duration-300"
              disabled={isLoading}
              aria-label={t("buttons.updateEvent")}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>{t("buttons.updating")}</span>
                </>
              ) : (
                t("buttons.updateEvent")
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;
