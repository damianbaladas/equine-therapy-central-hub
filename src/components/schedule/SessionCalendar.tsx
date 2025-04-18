
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarViewType, DayWithSessions } from '@/hooks/calendar/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Session } from '@/types/professionals';
import CalendarDay from './CalendarDay';
import WeekDaysHeader from './WeekDaysHeader';
import DayHeader from './DayHeader';

interface SessionCalendarProps {
  calendarDays: DayWithSessions[];
  viewType: CalendarViewType;
  onDateClick: (date: Date) => void;
  currentDate: Date;
  onEditSession?: (session: Session) => void;
}

const SessionCalendar: React.FC<SessionCalendarProps> = ({
  calendarDays,
  viewType,
  onDateClick,
  currentDate,
  onEditSession
}) => {
  // Number of columns varies by view type
  const numColumns = viewType === 'day' ? 1 : viewType === 'week' ? 7 : 7;
  const isToday = (date: Date) => format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isSelected = (date: Date) => format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-4">
          {viewType === 'week' && <WeekDaysHeader />}
          {viewType === 'day' && <DayHeader currentDate={currentDate} />}
          
          <div className={`grid grid-cols-${numColumns} gap-1`}
            style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}>
            {calendarDays.map((dayInfo, idx) => (
              <CalendarDay 
                key={idx}
                dayInfo={dayInfo}
                viewType={viewType}
                isToday={isToday(dayInfo.date)}
                isSelected={isSelected(dayInfo.date)}
                onDateClick={onDateClick}
                onEditSession={onEditSession}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SessionCalendar;
