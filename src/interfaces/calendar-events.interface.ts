import { CalendarEventType } from "@/enums/calendar-event-type.enum";
import { Event } from "react-big-calendar";

export interface ICalendarEvent extends Event {
  color: string;
  type: CalendarEventType;
  value: number;
  cashBalance: number;
}
