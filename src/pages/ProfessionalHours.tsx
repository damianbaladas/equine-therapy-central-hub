
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { es } from 'date-fns/locale';
import { Download, PlusCircle } from 'lucide-react';

import DateNavigation from '@/components/schedule/DateNavigation';
import WorkHoursTable, { WorkHour } from '@/components/professionals/WorkHoursTable';
import AddWorkHoursDialog from '@/components/professionals/AddWorkHoursDialog';
import { useToast } from '@/hooks/use-toast';

interface Professional {
  id: number;
  name: string;
  lastName: string;
}

interface WorkHourEntry {
  id: number;
  professionalId: number;
  professionalName: string;
  date: string;
  hours: number;
}

const ProfessionalHours = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWorkHour, setNewWorkHour] = useState({
    professionalId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: 8,
  });
  
  const [professionals] = useState<Professional[]>([
    { id: 1, name: 'Ana', lastName: 'Silva' },
    { id: 2, name: 'Carlos', lastName: 'Rodríguez' },
    { id: 3, name: 'Laura', lastName: 'Torres' },
    { id: 4, name: 'Roberto', lastName: 'Méndez' },
    { id: 5, name: 'María', lastName: 'González', },
    { id: 6, name: 'Juan', lastName: 'López' },
  ]);

  const [workHourEntries, setWorkHourEntries] = useState<WorkHourEntry[]>([
    {
      id: 1,
      professionalId: 5,
      professionalName: 'María González',
      date: '2025-04-09',
      hours: 8
    },
    {
      id: 2,
      professionalId: 6,
      professionalName: 'Juan López',
      date: '2025-04-10',
      hours: 4
    },
    {
      id: 3,
      professionalId: 1,
      professionalName: 'Ana Silva',
      date: '2025-04-09',
      hours: 6
    },
    {
      id: 4,
      professionalId: 2,
      professionalName: 'Carlos Rodríguez',
      date: '2025-04-10',
      hours: 7
    },
  ]);

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

  const { displayText } = getDateRange();
  
  const handleExport = () => {
    alert("Esta funcionalidad generaría un reporte de horas trabajadas para descarga");
  };

  const handleAddWorkHours = () => {
    if (!newWorkHour.professionalId) {
      toast({
        title: "Error",
        description: "Por favor selecciona un profesional",
        variant: "destructive",
      });
      return;
    }

    const selectedProfessional = professionals.find(p => p.id === parseInt(newWorkHour.professionalId));
    if (!selectedProfessional) return;

    const newId = workHourEntries.length > 0 ? Math.max(...workHourEntries.map(h => h.id)) + 1 : 1;
    
    const workHourEntry: WorkHourEntry = {
      id: newId,
      professionalId: parseInt(newWorkHour.professionalId),
      professionalName: `${selectedProfessional.name} ${selectedProfessional.lastName}`,
      date: newWorkHour.date,
      hours: newWorkHour.hours,
    };

    setWorkHourEntries([...workHourEntries, workHourEntry]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Horas registradas",
      description: `Se han registrado ${newWorkHour.hours} horas para ${selectedProfessional.name} ${selectedProfessional.lastName}`,
    });

    setNewWorkHour({
      professionalId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: 8,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Control de Horas</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            variant="default" 
            className="bg-equine-green-600 hover:bg-equine-green-700 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Registrar Horas
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar reporte
          </Button>
        </div>
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

      <AddWorkHoursDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newWorkHour={newWorkHour}
        onNewWorkHourChange={setNewWorkHour}
        professionals={professionals}
        onSave={handleAddWorkHours}
      />
    </div>
  );
};

export default ProfessionalHours;
