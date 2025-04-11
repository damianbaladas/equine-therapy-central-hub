
import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { WorkHourEntry } from '@/types/professionals';
import { WorkHour } from '@/components/professionals/WorkHoursTable';
import { useToast } from '@/hooks/use-toast';

export type ViewType = 'day' | 'week' | 'month';
export type DisplayView = 'table' | 'calendar';

export const useProfessionalHours = (workHourEntries: WorkHourEntry[]) => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');
  const [displayView, setDisplayView] = useState<DisplayView>('table');
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);

  const getDateRange = () => {
    if (viewType === 'day') {
      return {
        start: currentDate,
        end: currentDate,
        displayText: format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: es })
      };
    } else if (viewType === 'week') {
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
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (viewType === 'day') {
      setCurrentDate(prev => direction === 'prev' ? new Date(prev.setDate(prev.getDate() - 1)) : new Date(prev.setDate(prev.getDate() + 1)));
    } else if (viewType === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  useEffect(() => {
    const { start, end } = getDateRange();
    
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    
    const filteredWorkHours = workHourEntries.filter(
      hour => hour.date >= startStr && hour.date <= endStr
    );
    
    const formattedWorkHours: WorkHour[] = filteredWorkHours.map(entry => ({
      professionalId: entry.professionalId,
      professionalName: entry.professionalName,
      date: entry.date,
      hoursWorked: entry.hours,
    }));
    
    setWorkHours(formattedWorkHours);
  }, [currentDate, viewType, workHourEntries]);

  const handleExport = () => {
    alert("Esta funcionalidad generaría un reporte de horas trabajadas para descarga");
  };

  const handleCalendarDateChange = (date: Date) => {
    setCurrentDate(date);
    setViewType('day');
  };

  return {
    currentDate,
    viewType,
    displayView,
    workHours,
    getDateRange,
    handleNavigate,
    handleExport,
    handleCalendarDateChange,
    setViewType,
    setDisplayView,
    toast
  };
};
