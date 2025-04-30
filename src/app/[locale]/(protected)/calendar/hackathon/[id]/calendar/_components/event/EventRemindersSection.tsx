// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/_components/event/EventRemindersSection.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";
import { scheduleEventReminderService } from "@/services/scheduleEventReminder.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface EventRemindersSectionProps {
  reminders: ScheduleEventReminder[];
  setReminders: (reminders: ScheduleEventReminder[]) => void;
  scheduleEventId?: string;
}

const EventRemindersSection: React.FC<EventRemindersSectionProps> = ({
  reminders,
  setReminders,
  scheduleEventId,
}) => {
  const { user } = useAuth();
  const [remindAt, setRemindAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userReminder, setUserReminder] =
    useState<ScheduleEventReminder | null>(null);
  const t = useTranslations("calendar.reminder");
  const toast = useToast();

  // Load the current user's reminder for this event when component mounts
  useEffect(() => {
    const loadUserReminder = async () => {
      if (!scheduleEventId || !user?.id) return;

      try {
        setIsLoading(true);

        // Get the reminder for the current user and this event
        const { data, message } =
          await scheduleEventReminderService.getScheduleEventReminderByScheduleEventIdAndUserId(
            scheduleEventId,
            user.id
          );

        if (data && data.id) {
          setUserReminder(data);
          // Update the reminders array to include only this user's reminder
          setReminders([data]);
        } else {
          setReminders([]);
        }
      } catch (error) {
        console.error("Failed to load user's event reminder", error);
        setReminders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserReminder();
    // Deliberately excluding toast from dependencies to avoid infinite loops
  }, [scheduleEventId, user?.id, setReminders]);

  const handleAddReminder = async () => {
    if (!user || !remindAt || !scheduleEventId) return;

    try {
      setIsLoading(true);

      // Call the API to create a new reminder
      const { data: newReminder, message } =
        await scheduleEventReminderService.createScheduleEventReminder({
          scheduleEventId: scheduleEventId,
          userId: user.id,
          remindAt: remindAt,
        });

      // Update the UI with the new reminder
      if (newReminder) {
        setUserReminder(newReminder);
        setReminders([newReminder]);
        toast.success(t("reminderAddedSuccess"));
      }

      // Clear the input field
      setRemindAt("");
    } catch (error: any) {
      console.error("Failed to add reminder:", error);
      toast.error(error.message || t("reminderAddedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveReminder = async (reminderId: string) => {
    try {
      setIsLoading(true);

      // Call the API to delete the reminder
      const { message } =
        await scheduleEventReminderService.deleteScheduleEventReminder(
          reminderId
        );

      // Update the UI by removing the deleted reminder
      setUserReminder(null);
      setReminders([]);
      toast.success(t("reminderRemovedSuccess"));
    } catch (error: any) {
      console.error("Failed to remove reminder:", error);
      toast.error(error.message || t("reminderRemovedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error("Invalid date format:", error);
      return dateString;
    }
  };

  return (
    <div className="mt-4 sm:mt-6 transition-colors duration-300">
      <h6 className="mb-3 sm:mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("myReminder")}
      </h6>

      {!userReminder && (
        <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:space-x-2">
          <input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            aria-label={t("selectReminderTime")}
            className="flex-1 h-10 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 transition-colors duration-200"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddReminder}
            disabled={!remindAt || isLoading}
            className="px-4 py-2 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label={isLoading ? t("adding") : t("add")}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" /> {t("adding")}
              </span>
            ) : (
              t("add")
            )}
          </button>
        </div>
      )}

      {isLoading && !userReminder ? (
        <div className="text-center py-4">
          <LoadingSpinner size="md" showText={true} />
          <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
            {t("loadingReminder")}
          </p>
        </div>
      ) : userReminder ? (
        <div className="space-y-2">
          <div
            key={userReminder.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              <div className="text-brand-500 mr-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-gray-200">
                  {t("reminderAt", {
                    datetime: formatDateTime(userReminder.remindAt),
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveReminder(userReminder.id)}
              disabled={isLoading}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
              aria-label={t("removeReminder")}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {t("noReminderSet")}
        </p>
      )}
    </div>
  );
};

export default EventRemindersSection;
