
import { Session } from '@/types/professionals';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  eachDayOfInterval, getDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarViewType, DateRange, DayWithSessions } from './types';

export function getSessionsForDate(date: Date, allSessions: Session[]): Session[] {
  const dateString = format(date, 'yyyy-MM-dd');
  return allSessions.filter(session => session.date === dateString);
}

export function getDateRange(currentDate: Date, viewType: CalendarViewType): DateRange {
  if (viewType === 'day') {
    return {
      start: currentDate,
      end: currentDate,
      displayText: format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
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
}

export function generateCalendarDays(
  dateRange: DateRange, 
  viewType: CalendarViewType, 
  currentDate: Date, 
  sessions: Session[]
): DayWithSessions[] {
  const { start, end } = dateRange;
  let days: DayWithSessions[] = [];
  
  if (viewType === 'day') {
    days = [{
      date: currentDate,
      sessions: getSessionsForDate(currentDate, sessions),
      isCurrentMonth: true
    }];
  } else if (viewType === 'month') {
    // Para vista mensual, incluir días de meses anteriores y siguientes
    // para llenar la cuadrícula del calendario
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Obtener el primer día de la semana para el inicio del mes
    let startDay = getDay(monthStart);
    if (startDay === 0) startDay = 7; // Ajustar para weekStartsOn: 1
    
    // Agregar días del mes anterior
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
    
    // Agregar días del mes actual
    const currentMonthDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    }).map(date => ({
      date,
      sessions: getSessionsForDate(date, sessions),
      isCurrentMonth: true
    }));
    days = [...days, ...currentMonthDays];
    
    // Calcular cuántos días agregar del próximo mes para completar la cuadrícula
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
    // Para vista semanal, solo obtener los días de la semana
    days = eachDayOfInterval({ start, end }).map(date => ({
      date,
      sessions: getSessionsForDate(date, sessions),
      isCurrentMonth: true
    }));
  }
  
  return days;
}

export function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
