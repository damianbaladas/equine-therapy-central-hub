import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, PlusCircle } from 'lucide-react';

import DateNavigation from '@/components/schedule/DateNavigation';
import WorkHoursTable, { WorkHour } from '@/components/professionals/WorkHoursTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

interface AdminHour {
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
  const [newAdminHour, setNewAdminHour] = useState({
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

  const [adminHours, setAdminHours] = useState<AdminHour[]>([
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
  ]);
  
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
    
    const filteredSessions = sessions.filter(
      session => session.date >= startStr && session.date <= endStr
    );
    
    const filteredAdminHours = adminHours.filter(
      hour => hour.date >= startStr && hour.date <= endStr
    );
    
    const sessionsWorkHours: WorkHour[] = [];
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
      dateStats.hours += 1;
      dateStats.sessions += 1;
    });
    
    professionalWorkMap.forEach((dateMap, professionalKey) => {
      const professionalId = parseInt(professionalKey);
      const professional = filteredSessions.find(s => s.professionalId === professionalId);
      
      if (professional) {
        dateMap.forEach((stats, date) => {
          sessionsWorkHours.push({
            professionalId,
            professionalName: professional.professionalName,
            date,
            hoursWorked: stats.hours,
            sessionsCount: stats.sessions,
            isAdministrative: false
          });
        });
      }
    });
    
    const adminWorkHours: WorkHour[] = filteredAdminHours.map(adminHour => ({
      professionalId: adminHour.professionalId,
      professionalName: adminHour.professionalName,
      date: adminHour.date,
      hoursWorked: adminHour.hours,
      sessionsCount: 0,
      isAdministrative: true
    }));
    
    setWorkHours([...sessionsWorkHours, ...adminWorkHours]);
  }, [currentDate, viewType, sessions, adminHours]);

  const { displayText } = getDateRange();
  
  const handleExport = () => {
    alert("Esta funcionalidad generaría un reporte de horas trabajadas para descarga");
  };

  const handleAddAdminHours = () => {
    if (!newAdminHour.professionalId) {
      toast({
        title: "Error",
        description: "Por favor selecciona un profesional",
        variant: "destructive",
      });
      return;
    }

    const selectedProfessional = professionals.find(p => p.id === parseInt(newAdminHour.professionalId));
    if (!selectedProfessional) return;

    const newId = adminHours.length > 0 ? Math.max(...adminHours.map(h => h.id)) + 1 : 1;
    
    const adminHourEntry: AdminHour = {
      id: newId,
      professionalId: parseInt(newAdminHour.professionalId),
      professionalName: `${selectedProfessional.name} ${selectedProfessional.lastName}`,
      date: newAdminHour.date,
      hours: newAdminHour.hours,
    };

    setAdminHours([...adminHours, adminHourEntry]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Horas administrativas registradas",
      description: `Se han registrado ${newAdminHour.hours} horas para ${selectedProfessional.name} ${selectedProfessional.lastName}`,
    });

    setNewAdminHour({
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-equine-green-600 hover:bg-equine-green-700 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Registrar Horas Administrativas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Horas Administrativas</DialogTitle>
                <DialogDescription>
                  Ingresa las horas trabajadas para personal administrativo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="professional" className="text-right">
                    Profesional
                  </Label>
                  <Select 
                    value={newAdminHour.professionalId} 
                    onValueChange={value => setNewAdminHour({...newAdminHour, professionalId: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona un profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map(professional => (
                        <SelectItem key={professional.id} value={professional.id.toString()}>
                          {professional.name} {professional.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAdminHour.date}
                    onChange={e => setNewAdminHour({...newAdminHour, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hours" className="text-right">
                    Horas
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="24"
                    value={newAdminHour.hours}
                    onChange={e => setNewAdminHour({...newAdminHour, hours: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddAdminHours}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
    </div>
  );
};

export default ProfessionalHours;
