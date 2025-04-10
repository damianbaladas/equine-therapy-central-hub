
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download } from 'lucide-react';

import DateNavigation from '@/components/schedule/DateNavigation';
import WorkHoursTable, { WorkHour } from '@/components/professionals/WorkHoursTable';

interface Session {
  id: number;
  date: string;
  time: string;
  patientId: number;
  patientName: string;
  professionalId: number;
  professionalName: string;
  horseId: number;
  horseName: string;
}

interface Professional {
  id: number;
  name: string;
  lastName: string;
}

const ProfessionalHours = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  
  const [sessions] = useState<Session[]>([
    {
      id: 1,
      date: '2025-04-09',
      time: '10:00',
      patientId: 1,
      patientName: 'Juan Pérez',
      professionalId: 1,
      professionalName: 'Ana Silva',
      horseId: 1,
      horseName: 'Luna'
    },
    {
      id: 2,
      date: '2025-04-09',
      time: '11:00',
      patientId: 2,
      patientName: 'María González',
      professionalId: 2,
      professionalName: 'Carlos Rodríguez',
      horseId: 2,
      horseName: 'Trueno'
    },
    {
      id: 3,
      date: '2025-04-09',
      time: '12:00',
      patientId: 3,
      patientName: 'Diego Martínez',
      professionalId: 3,
      professionalName: 'Laura Torres',
      horseId: 3,
      horseName: 'Estrella'
    },
    {
      id: 4,
      date: '2025-04-09',
      time: '16:00',
      patientId: 4,
      patientName: 'Valentina López',
      professionalId: 4,
      professionalName: 'Roberto Méndez',
      horseId: 5,
      horseName: 'Tornado'
    },
    {
      id: 5,
      date: '2025-04-10',
      time: '10:00',
      patientId: 1,
      patientName: 'Juan Pérez',
      professionalId: 1,
      professionalName: 'Ana Silva',
      horseId: 1,
      horseName: 'Luna'
    },
    {
      id: 6,
      date: '2025-04-10',
      time: '14:00',
      patientId: 2,
      patientName: 'María González',
      professionalId: 2,
      professionalName: 'Carlos Rodríguez',
      horseId: 2,
      horseName: 'Trueno'
    },
    {
      id: 7,
      date: '2025-04-11',
      time: '11:00',
      patientId: 3,
      patientName: 'Diego Martínez',
      professionalId: 1,
      professionalName: 'Ana Silva',
      horseId: 3,
      horseName: 'Estrella'
    }
  ]);

  // Calculate start and end date based on view type
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

  // Navigate between dates
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (viewType === 'day') {
      setCurrentDate(prev => direction === 'prev' ? new Date(prev.setDate(prev.getDate() - 1)) : new Date(prev.setDate(prev.getDate() + 1)));
    } else if (viewType === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  // Calculate work hours based on sessions and date range
  useEffect(() => {
    const { start, end } = getDateRange();
    
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    
    // Filter sessions within the date range
    const filteredSessions = sessions.filter(
      session => session.date >= startStr && session.date <= endStr
    );
    
    // Group by professional and date
    const professionalWorkMap = new Map<string, Map<string, { hours: number, sessions: number }>>();
    
    filteredSessions.forEach(session => {
      const professionalKey = `${session.professionalId}`;
      const dateKey = session.date;
      
      if (!professionalWorkMap.has(professionalKey)) {
        professionalWorkMap.set(professionalKey, new Map());
      }
      
      const professionalDates = professionalWorkMap.get(professionalKey)!;
      
      if (!professionalDates.has(dateKey)) {
        professionalDates.set(dateKey, { hours: 0, sessions: 0 });
      }
      
      const dateStats = professionalDates.get(dateKey)!;
      dateStats.hours += 1; // Assuming each session is 1 hour
      dateStats.sessions += 1;
    });
    
    // Convert to WorkHour array
    const workHoursData: WorkHour[] = [];
    
    professionalWorkMap.forEach((dateMap, professionalKey) => {
      const professionalId = parseInt(professionalKey);
      const professional = filteredSessions.find(s => s.professionalId === professionalId);
      
      if (professional) {
        dateMap.forEach((stats, date) => {
          workHoursData.push({
            professionalId,
            professionalName: professional.professionalName,
            date,
            hoursWorked: stats.hours,
            sessionsCount: stats.sessions
          });
        });
      }
    });
    
    setWorkHours(workHoursData);
  }, [currentDate, viewType, sessions]);

  const { displayText } = getDateRange();
  
  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF file
    alert("Esta funcionalidad generaría un reporte de horas trabajadas para descarga");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Control de Horas</h1>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar reporte
        </Button>
      </div>

      <DateNavigation
        currentDate={currentDate}
        onNavigate={handleNavigate}
        viewType={viewType}
        onViewChange={setViewType}
      />

      <WorkHoursTable 
        workHours={workHours} 
        period={displayText}
      />
    </div>
  );
};

export default ProfessionalHours;
