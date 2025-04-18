
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DayWithSessions } from '@/hooks/calendar/types';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CalendarViewType } from '@/hooks/calendar/types';
import { Session } from '@/types/professionals';
import SessionItem from './SessionItem';

interface CalendarDayProps {
  dayInfo: DayWithSessions;
  viewType: CalendarViewType;
  isToday: boolean;
  isSelected: boolean;
  onDateClick: (date: Date) => void;
  onEditSession?: (session: Session) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  dayInfo,
  viewType,
  isToday,
  isSelected,
  onDateClick,
  onEditSession
}) => {
  return (
    <div 
      className={`
        min-h-[100px] p-1 border rounded-md cursor-pointer transition-colors
        ${!dayInfo.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
        ${isToday ? 'border-blue-500 border-2' : ''}
        ${isSelected ? 'bg-blue-50' : ''}
        ${viewType === 'day' ? 'min-h-[300px]' : ''}
        hover:bg-blue-50
      `}
      onClick={() => onDateClick(dayInfo.date)}
      title={viewType === 'month' ? 'Haz clic para ver detalles del día' : ''}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${
          isToday ? 'text-blue-600' : ''
        }`}>
          {format(dayInfo.date, 'd')}
        </span>
        {(viewType === 'month' || viewType === 'day') && dayInfo.sessions.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {dayInfo.sessions.length}
          </Badge>
        )}
      </div>
      
      {/* En vistas de semana o día, mostrar detalles de sesiones */}
      {(viewType === 'week' || viewType === 'day') && (
        <div className={`space-y-1 overflow-y-auto ${viewType === 'day' ? 'max-h-[250px]' : 'max-h-[80px]'}`}>
          {dayInfo.sessions.map(session => (
            <SessionItem 
              key={session.id} 
              session={session} 
              onEdit={onEditSession}
            />
          ))}
        </div>
      )}
      
      {/* En vista mensual, solo mostrar indicadores */}
      {viewType === 'month' && dayInfo.sessions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {dayInfo.sessions.slice(0, 3).map(session => (
            <Tooltip key={session.id}>
              <TooltipTrigger>
                <div 
                  className="w-2 h-2 rounded-full bg-equine-green-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditSession) onEditSession(session);
                  }}
                />
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
  );
};

export default CalendarDay;
