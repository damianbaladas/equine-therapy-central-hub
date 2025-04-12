
import { useState, useMemo } from 'react';
import { Session } from '@/types/professionals';
import { useToast } from '@/hooks/use-toast';
import { addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { CalendarViewType, CalendarState } from './types';
import { getDateRange, generateCalendarDays } from './utils';

export const useSessionCalendar = (sessions: Session[]): CalendarState => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('week');
  const [isCreateBatchDialogOpen, setIsCreateBatchDialogOpen] = useState(false);

  const dateRange = useMemo(() => 
    getDateRange(currentDate, viewType), [currentDate, viewType]
  );

  const calendarDays = useMemo(() => 
    generateCalendarDays(dateRange, viewType, currentDate, sessions),
    [dateRange, viewType, currentDate, sessions]
  );

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (viewType === 'day') {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
        return newDate;
      });
    } else if (viewType === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  const handleDateClick = (date: Date) => {
    // Actualizar la fecha actual al día seleccionado
    setCurrentDate(date);
    // Si estamos en vista mensual, cambiamos a vista diaria al hacer clic en un día
    if (viewType === 'month') {
      setViewType('day');
    }
  };

  const showCreateBatchDialog = () => {
    setIsCreateBatchDialogOpen(true);
  };

  return {
    currentDate,
    setCurrentDate,
    viewType,
    setViewType,
    dateRange,
    calendarDays,
    handleNavigate,
    handleDateClick,
    isCreateBatchDialogOpen,
    setIsCreateBatchDialogOpen,
    showCreateBatchDialog,
  };
};
