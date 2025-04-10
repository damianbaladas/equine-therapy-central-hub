
import { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, 
  startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, 
  isSameDay, parseISO, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Session } from '@/types/professionals';
import { useToast } from '@/hooks/use-toast';

export type CalendarViewType = 'week' | 'month';

export interface DayWithSessions {
  date: Date;
  sessions: Session[];
  isCurrentMonth?: boolean;
}

export const useSessionCalendar = (sessions: Session[]) => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('week');
  const [isCreateBatchDialogOpen, setIsCreateBatchDialogOpen] = useState(false);

  const dateRange = useMemo(() => {
    if (viewType === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return {
        start,
        end,
        displayText: `${format(start, "d 'de' MMMM", { locale: es })} - ${format(end, "d 'de' MMMM 'de' yyyy", { locale: es })}`
      };
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return {
        start,
        end,
        displayText: format(currentDate, "MMMM 'de' yyyy", { locale: es })
      };
    }
  }, [currentDate, viewType]);

  const calendarDays = useMemo(() => {
    const { start, end } = dateRange;
    
    let days: DayWithSessions[] = [];
    
    if (viewType === 'month') {
      // For month view, we need to include days from previous and next months
      // to fill the calendar grid
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      // Get the first day of the week for the month start
      let startDay = getDay(monthStart);
      if (startDay === 0) startDay = 7; // Adjust for weekStartsOn: 1
      
      // Add days from previous month
      const prevMonthDays = startDay - 1;
      if (prevMonthDays > 0) {
        const prevMonth = eachDayOfInterval({
          start: addDays(monthStart, -prevMonthDays),
          end: addDays(monthStart, -1)
        }).map(date => ({
          date,
          sessions: getSessionsForDate(date, sessions),
          isCurrentMonth: false
        }));
        days = [...days, ...prevMonth];
      }
      
      // Add days from current month
      const currentMonthDays = eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      }).map(date => ({
        date,
        sessions: getSessionsForDate(date, sessions),
        isCurrentMonth: true
      }));
      days = [...days, ...currentMonthDays];
      
      // Calculate how many days to add from next month to complete the grid
      const totalDaysShown = Math.ceil(days.length / 7) * 7;
      const nextMonthDays = totalDaysShown - days.length;
      
      if (nextMonthDays > 0) {
        const nextMonth = eachDayOfInterval({
          start: addDays(monthEnd, 1),
          end: addDays(monthEnd, nextMonthDays)
        }).map(date => ({
          date,
          sessions: getSessionsForDate(date, sessions),
          isCurrentMonth: false
        }));
        days = [...days, ...nextMonth];
      }
    } else {
      // For week view, just get the days of the week
      days = eachDayOfInterval({ start, end }).map(date => ({
        date,
        sessions: getSessionsForDate(date, sessions),
        isCurrentMonth: true
      }));
    }
    
    return days;
  }, [dateRange, viewType, sessions, currentDate]);
  
  const getSessionsForDate = (date: Date, allSessions: Session[]): Session[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return allSessions.filter(session => session.date === dateString);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (viewType === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
  };

  const showCreateBatchDialog = () => {
    setIsCreateBatchDialogOpen(true);
  };

  return {
    currentDate,
    viewType,
    dateRange,
    calendarDays,
    handleNavigate,
    handleDateClick,
    setViewType,
    isCreateBatchDialogOpen,
    setIsCreateBatchDialogOpen,
    showCreateBatchDialog,
    toast
  };
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
