
import { useState } from 'react';
import { format } from 'date-fns';
import { Professional, WorkHourEntry } from '@/types/professionals';
import { useToast } from '@/hooks/use-toast';

export const useWorkHourEntries = (initialEntries: WorkHourEntry[], professionals: Professional[]) => {
  const { toast } = useToast();
  const [workHourEntries, setWorkHourEntries] = useState<WorkHourEntry[]>(initialEntries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [newWorkHour, setNewWorkHour] = useState({
    professionalId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: 8,
  });

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

  const handleBatchAddWorkHours = (date: string, entries: { professionalId: number, hours: number }[]) => {
    const newEntries: WorkHourEntry[] = entries.map(entry => {
      const professional = professionals.find(p => p.id === entry.professionalId);
      if (!professional) return null;

      const newId = workHourEntries.length > 0 ? Math.max(...workHourEntries.map(h => h.id)) + 1 : 1;
      
      return {
        id: newId + entries.indexOf(entry),
        professionalId: entry.professionalId,
        professionalName: `${professional.name} ${professional.lastName}`,
        date,
        hours: entry.hours,
      };
    }).filter(Boolean) as WorkHourEntry[];

    setWorkHourEntries([...workHourEntries, ...newEntries]);
    
    toast({
      title: "Horas registradas en lote",
      description: `Se registraron horas para ${newEntries.length} profesionales`,
    });
  };

  return {
    workHourEntries,
    isAddDialogOpen,
    isBatchDialogOpen,
    newWorkHour,
    setIsAddDialogOpen,
    setIsBatchDialogOpen,
    setNewWorkHour,
    handleAddWorkHours,
    handleBatchAddWorkHours
  };
};
