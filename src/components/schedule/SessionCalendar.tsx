
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarViewType, DayWithSessions } from '@/hooks/useSessionCalendar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Session } from '@/types/professionals';

interface SessionCalendarProps {
  calendarDays: DayWithSessions[];
  viewType: CalendarViewType;
  onDateClick: (date: Date) => void;
  currentDate: Date;
}

const SessionCalendar: React.FC<SessionCalendarProps> = ({
  calendarDays,
  viewType,
  onDateClick,
  currentDate
}) => {
  // Number of columns varies by view type
  const numColumns = viewType === 'day' ? 1 : viewType === 'week' ? 7 : 7;
  const isToday = (date: Date) => format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isSelected = (date: Date) => format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-4">
          {viewType === 'week' && (
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                <div key={index} className="text-center text-sm font-medium py-1">
                  {day}
                </div>
              ))}
            </div>
          )}
          
          <div className={`grid grid-cols-${numColumns} gap-1`}
            style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}>
            {calendarDays.map((dayInfo, idx) => (
              <div 
                key={idx} 
                className={`
                  min-h-[100px] p-1 border rounded-md cursor-pointer transition-colors
                  ${!dayInfo.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isToday(dayInfo.date) ? 'border-blue-500 border-2' : ''}
                  ${isSelected(dayInfo.date) ? 'bg-blue-50' : ''}
                  ${viewType === 'day' ? 'min-h-[300px]' : ''}
                `}
                onClick={() => onDateClick(dayInfo.date)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(dayInfo.date) ? 'text-blue-600' : ''
                  }`}>
                    {format(dayInfo.date, 'd')}
                  </span>
                  {(viewType === 'month' || viewType === 'day') && dayInfo.sessions.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {dayInfo.sessions.length}
                    </Badge>
                  )}
                </div>
                
                {/* In week or day view, show session details */}
                {(viewType === 'week' || viewType === 'day') && (
                  <div className={`space-y-1 overflow-y-auto ${viewType === 'day' ? 'max-h-[250px]' : 'max-h-[80px]'}`}>
                    {dayInfo.sessions.map(session => (
                      <SessionItem key={session.id} session={session} />
                    ))}
                  </div>
                )}
                
                {/* In month view, just show indicators */}
                {viewType === 'month' && dayInfo.sessions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dayInfo.sessions.slice(0, 3).map(session => (
                      <Tooltip key={session.id}>
                        <TooltipTrigger>
                          <div className="w-2 h-2 rounded-full bg-equine-green-600"></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{session.time} - {session.patientName}</p>
                          <p className="text-xs">{session.professionalName}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {dayInfo.sessions.length > 3 && (
                      <span className="text-xs text-gray-500">+{dayInfo.sessions.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

const SessionItem: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="px-1 py-0.5 bg-equine-green-50 border border-equine-green-200 rounded text-xs truncate">
          {session.time} - {session.patientName}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div><strong>{session.patientName}</strong></div>
          <div>Hora: {session.time}</div>
          <div>Prof: {session.professionalName}</div>
          <div>Caballo: {session.horseName}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default SessionCalendar;
