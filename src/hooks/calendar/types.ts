
import { Session } from '@/types/professionals';

export type CalendarViewType = 'day' | 'week' | 'month';

export interface DayWithSessions {
  date: Date;
  sessions: Session[];
  isCurrentMonth?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
  displayText: string;
}

export interface CalendarState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  viewType: CalendarViewType;
  setViewType: (viewType: CalendarViewType) => void;
  dateRange: DateRange;
  calendarDays: DayWithSessions[];
  handleNavigate: (direction: 'prev' | 'next') => void;
  handleDateClick: (date: Date) => void;
  isCreateBatchDialogOpen: boolean;
  setIsCreateBatchDialogOpen: (isOpen: boolean) => void;
  showCreateBatchDialog: () => void;
}
