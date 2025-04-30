// src/services/scheduleEventService.ts
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";
import { scheduleEventService } from "@/services/scheduleEvent.service";
import { CalendarEvent } from "@/components/calendar/Calendar";

interface CreateScheduleEventRequest {
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  eventLabel?: ScheduleEventLabel;
  scheduleId: string; // The ID of the schedule this event belongs to
}

/**
 * Creates a new schedule event
 * @param scheduleId - The ID of the schedule to add the event to
 * @param eventData - The event data
 * @returns The created schedule event
 */
export async function createScheduleEvent(
  scheduleId: string,
  eventData: Omit<CreateScheduleEventRequest, "scheduleId">
) {
  try {
    // Validate required fields
    if (!eventData.name || !eventData.startTime) {
      throw new Error("Name and start time are required");
    }

    // Validate that end time is after start time
    if (
      eventData.endTime &&
      new Date(eventData.endTime) <= new Date(eventData.startTime)
    ) {
      throw new Error("End time must be after start time");
    }

    // Call the real service - making sure to pass eventLabel
    const response = await scheduleEventService.createScheduleEvent({
      scheduleId,
      name: eventData.name,
      description: eventData.description || "",
      location: eventData.location || "",
      startTime: eventData.startTime,
      endTime: eventData.endTime || eventData.startTime, // Default to start time if not provided
      eventLabel: eventData.eventLabel?.toUpperCase() as any,
      isRecurring: false, // Default to false
      recurrenceRule: undefined, // Default to undefined
    });

    if (!response || !response.data) {
      throw new Error(response?.message || "Failed to create schedule event");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to create schedule event:", error);
    throw error;
  }
}

/**
 * Integrates with the existing Calendar component to add a new event
 * @param scheduleId - The ID of the schedule
 * @param eventData - The event data to create
 * @returns The event in CalendarEvent format
 */
export async function addEventToCalendar(
  scheduleId: string,
  eventData: {
    name: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    eventLabel?: ScheduleEventLabel;
  }
): Promise<CalendarEvent> {
  const createdEvent = await createScheduleEvent(scheduleId, {
    name: eventData.name,
    description: eventData.description,
    location: eventData.location,
    startTime: eventData.startTime,
    endTime: eventData.endTime,
    eventLabel: eventData.eventLabel,
  });

  // Transform to the format expected by the Calendar component
  return {
    id: createdEvent.id,
    title: createdEvent.name,
    start: createdEvent.startTime,
    end: createdEvent.endTime,
    allDay: false,
    extendedProps: {
      calendar:
        (createdEvent.eventLabel?.toLowerCase() as ScheduleEventLabel) ||
        "primary",
      scheduleId: createdEvent.scheduleId || scheduleId,
      description: createdEvent.description,
      location: createdEvent.location,
    },
  };
}
