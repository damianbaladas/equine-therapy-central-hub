
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateNavigationProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
  viewType?: 'day' | 'week' | 'month';
  onViewChange?: (view: 'day' | 'week' | 'month') => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ 
  currentDate, 
  onNavigate, 
  viewType = 'day',
  onViewChange 
}) => {
  const getDateDisplay = () => {
    if (viewType === 'day') {
      return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    } else if (viewType === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "d", { locale: es })} - ${format(end, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
    } else {
      return format(currentDate, "MMMM 'de' yyyy", { locale: es });
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => onNavigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-xl font-medium">
              {getDateDisplay()}
            </h2>
            
            {onViewChange && (
              <Select 
                value={viewType} 
                onValueChange={(value: 'day' | 'week' | 'month') => onViewChange(value)}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Seleccionar vista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Vista diaria</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="week">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Vista semanal</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="month">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Vista mensual</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => onNavigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateNavigation;
