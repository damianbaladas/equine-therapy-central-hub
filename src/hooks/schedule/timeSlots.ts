
import { Session } from '@/types/professionals';
import { formatDate } from './types';

export function generateTimeSlots(currentDate: Date, sessions: Session[]) {
  return Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    const time = `${hour}:00`;
    return {
      time,
      sessions: sessions.filter(s => s.date === formatDate(currentDate) && s.time === time)
    };
  });
}
