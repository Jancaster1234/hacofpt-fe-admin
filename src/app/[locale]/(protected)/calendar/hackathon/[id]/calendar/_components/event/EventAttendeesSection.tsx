// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/_components/event/EventAttendeesSection.tsx
import React, { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import {
  ScheduleEventAttendee,
  ScheduleEventStatus,
} from "@/types/entities/scheduleEventAttendee";
import { scheduleEventAttendeeService } from "@/services/scheduleEventAttendee.service";
import { userService } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface EventAttendeesSectionProps {
  attendees: ScheduleEventAttendee[];
  setAttendees: (attendees: ScheduleEventAttendee[]) => void;
  teamMembers: User[];
  scheduleEventId?: string;
}

interface AttendeeWithUser extends ScheduleEventAttendee {
  user?: User;
}

const EventAttendeesSection: React.FC<EventAttendeesSectionProps> = ({
  attendees,
  setAttendees,
  teamMembers,
  scheduleEventId,
}) => {
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendeesWithUsers, setAttendeesWithUsers] = useState<
    AttendeeWithUser[]
  >([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Get current user from auth hook
  const { user: currentUser } = useAuth();

  // Toast notifications
  const toast = useToast();

  // Translations
  const t = useTranslations("eventAttendees");

  // Load attendees when component mounts or schedule event ID changes
  useEffect(() => {
    if (scheduleEventId) {
      loadAttendees();
    }
  }, [scheduleEventId]);

  // Fetch user information for each attendee when attendees array changes
  useEffect(() => {
    fetchUsersForAttendees();
  }, [attendees]);

  const loadAttendees = async () => {
    if (!scheduleEventId) return;

    setIsLoading(true);
    try {
      const { data, message } =
        await scheduleEventAttendeeService.getAttendeesByScheduleEventId(
          scheduleEventId
        );
      setAttendees(data);
    } catch (error) {
      console.error("Failed to load attendees", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersForAttendees = async () => {
    if (!attendees.length) {
      setAttendeesWithUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const updatedAttendees = await Promise.all(
        attendees.map(async (attendee) => {
          if (!attendee.userId) {
            return { ...attendee, user: undefined };
          }

          try {
            const { data: user } = await userService.getUserById(
              attendee.userId
            );
            return { ...attendee, user };
          } catch (error) {
            console.error(
              `Failed to fetch user for attendee ${attendee.id}`,
              error
            );
            return { ...attendee, user: undefined };
          }
        })
      );

      setAttendeesWithUsers(updatedAttendees);
    } catch (error) {
      console.error("Failed to fetch users for attendees", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendee = async (user: User) => {
    if (!scheduleEventId) return;

    // Check if user is already an attendee
    if (attendees.some((a) => a.userId === user.id)) {
      return;
    }

    setActionInProgress("add");
    try {
      // Make API call to add attendee
      const { data: newAttendee, message } =
        await scheduleEventAttendeeService.addAttendeeToScheduleEvent({
          scheduleEventId,
          userId: user.id,
          status: "INVITED",
        });

      // Update local state with the new attendee from API
      setAttendees([...attendees, newAttendee]);

      // Show success toast
      toast.success(t("attendeeAddedSuccess"));
    } catch (error: any) {
      console.error("Failed to add attendee", error);
      toast.error(error.message || t("attendeeAddedError"));
    } finally {
      setActionInProgress(null);
      setShowMemberSelector(false);
    }
  };

  const handleRemoveAttendee = async (attendeeId: string) => {
    setActionInProgress(`remove-${attendeeId}`);
    try {
      // Make API call to remove attendee
      const { message } =
        await scheduleEventAttendeeService.removeAttendeeFromScheduleEvent(
          attendeeId
        );

      // Update local state
      setAttendees(attendees.filter((a) => a.id !== attendeeId));

      // Show success toast
      toast.success(t("attendeeRemovedSuccess"));
    } catch (error: any) {
      console.error("Failed to remove attendee", error);
      toast.error(error.message || t("attendeeRemovedError"));
    } finally {
      setActionInProgress(null);
    }
  };

  const handleChangeStatus = async (
    attendeeId: string,
    status: ScheduleEventStatus
  ) => {
    if (!scheduleEventId) return;

    setActionInProgress(`status-${attendeeId}`);
    try {
      // Get the attendee object
      const attendee = attendees.find((a) => a.id === attendeeId);

      if (!attendee) {
        console.error("Attendee not found");
        return;
      }

      // Make API call to update attendee's status
      const { data: updatedAttendee, message } =
        await scheduleEventAttendeeService.updateScheduleEventAttendeeStatus(
          attendeeId,
          {
            scheduleEventId: scheduleEventId,
            userId: attendee.userId,
            status: status,
          }
        );

      // Update local state with the updated attendee data from API
      setAttendees(
        attendees.map((a) => (a.id === attendeeId ? updatedAttendee : a))
      );

      // Show success toast
      toast.success(t("statusUpdateSuccess"));
    } catch (error: any) {
      console.error("Failed to update attendee status", error);
      toast.error(error.message || t("statusUpdateError"));
    } finally {
      setActionInProgress(null);
    }
  };

  // Check if current user is an organizer
  const isOrganizer = currentUser?.userRoles?.some(
    (userRole) => userRole.role.name === "ORGANIZER"
  );

  // Check if the attendee is the current user
  const isCurrentUserAttendee = (userId?: string) => {
    return userId === currentUser?.id;
  };

  // Filter out team members who are already attendees
  const availableTeamMembers = teamMembers.filter(
    (member) => !attendees.some((a) => a.userId === member.id)
  );

  return (
    <div className="mt-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("attendeesTitle")}
        </h6>
        <button
          type="button"
          onClick={() => setShowMemberSelector(!showMemberSelector)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors duration-200 shadow-sm w-full sm:w-auto"
          disabled={isLoading || actionInProgress === "add"}
          aria-label={t("addAttendeeAriaLabel")}
        >
          {actionInProgress === "add" ? (
            <LoadingSpinner size="sm" className="mr-1" />
          ) : null}
          {t("addAttendee")}
        </button>
      </div>

      {isLoading && !actionInProgress && (
        <div className="text-center py-3">
          <LoadingSpinner size="md" showText={true} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t("loadingAttendees")}
          </p>
        </div>
      )}

      {showMemberSelector && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800 transition-colors duration-200 shadow-sm">
          <h6 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("selectTeamMember")}
          </h6>
          {availableTeamMembers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("allMembersAdded")}
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pr-1">
              {availableTeamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleAddAttendee(member)}
                  className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  role="button"
                  aria-label={`${t("addMember")}: ${member.firstName} ${member.lastName}`}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                    {member.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {attendeesWithUsers.length > 0 ? (
        <div className="space-y-2">
          {attendeesWithUsers.map((attendee) => {
            const canManageAttendee =
              isOrganizer || isCurrentUserAttendee(attendee.userId);
            const isRemoveInProgress =
              actionInProgress === `remove-${attendee.id}`;
            const isStatusInProgress =
              actionInProgress === `status-${attendee.id}`;

            return (
              <div
                key={attendee.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200"
              >
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                    {attendee.user?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {attendee.user?.firstName} {attendee.user?.lastName}
                      {isCurrentUserAttendee(attendee.userId) && (
                        <span className="ml-2 text-xs text-brand-500 dark:text-brand-400">
                          ({t("you")})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">
                      {attendee.user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-11 sm:ml-0">
                  <div className="relative">
                    {isStatusInProgress && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-lg z-10">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                    <select
                      value={attendee.status}
                      onChange={(e) =>
                        handleChangeStatus(
                          attendee.id,
                          e.target.value as ScheduleEventStatus
                        )
                      }
                      className={`text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-1.5 dark:bg-gray-700 dark:text-gray-200 transition-colors duration-200 ${
                        !canManageAttendee
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      disabled={
                        isLoading || !canManageAttendee || isStatusInProgress
                      }
                      aria-label={t("changeStatus")}
                    >
                      <option value="INVITED">{t("statusInvited")}</option>
                      <option value="CONFIRMED">{t("statusConfirmed")}</option>
                      <option value="DECLINED">{t("statusDeclined")}</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveAttendee(attendee.id)}
                    className={`p-1.5 rounded-full ${
                      canManageAttendee
                        ? "hover:bg-gray-200 dark:hover:bg-gray-700"
                        : "opacity-60 cursor-not-allowed"
                    } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                    disabled={
                      isLoading || !canManageAttendee || isRemoveInProgress
                    }
                    aria-label={t("removeAttendee")}
                  >
                    {isRemoveInProgress ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
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
            );
          })}
        </div>
      ) : (
        !isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            {t("noAttendees")}
          </p>
        )
      )}
    </div>
  );
};

export default EventAttendeesSection;
