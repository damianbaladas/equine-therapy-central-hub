
import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { WorkHour } from './WorkHoursTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WorkHoursCalendarProps {
  workHours: WorkHour[];
  period: string;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

interface DayWithHours {
  date: Date;
  hours: number;
  professionals: Set<string>;
}

const WorkHoursCalendar: React.FC<WorkHoursCalendarProps> = ({ 
  workHours, 
  period,
  currentDate,
  onDateChange
}) => {
  // Process work hours into a format suitable for the calendar
  const workHoursByDate = React.useMemo(() => {
    const hoursByDate = new Map<string, DayWithHours>();

    workHours.forEach(hour => {
      const dateStr = hour.date;
      const existing = hoursByDate.get(dateStr);
      const date = parseISO(dateStr);

      if (existing) {
        existing.hours += hour.hoursWorked;
        existing.professionals.add(hour.professionalName);
      } else {
        hoursByDate.set(dateStr, {
          date,
          hours: hour.hoursWorked,
          professionals: new Set([hour.professionalName])
        });
      }
    });

    return hoursByDate;
  }, [workHours]);

  // Custom day render function to show hours
  const renderDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayData = workHoursByDate.get(dateStr);

    if (!dayData) {
      return <div>{format(day, 'd')}</div>;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div>{format(day, 'd')}</div>
              <Badge 
                variant="secondary" 
                className="absolute bottom-0 text-[0.6rem] px-1 py-0 min-w-[1.2rem] flex items-center justify-center"
              >
                {dayData.hours}h
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-bold">{format(day, "EEEE, d 'de' MMMM", { locale: es })}</p>
              <p>Total: {dayData.hours} horas</p>
              <p>Profesionales: {Array.from(dayData.professionals).join(', ')}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-equine-green-600" />
            Calendario de horas
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-equine-green-50">
            {period}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center p-4">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => date && onDateChange(date)}
            className="rounded-md border"
            components={{
              Day: ({ date, ...props }) => (
                <div {...props}>
                  {renderDay(date)}
                </div>
              ),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkHoursCalendar;
