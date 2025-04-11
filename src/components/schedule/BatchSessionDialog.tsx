
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Patient, Professional, Horse } from '@/types/professionals';

interface BatchSessionEntry {
  patientId: number;
  professionalId: number;
  horseId: number;
  time: string;
}

interface BatchSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patients: Patient[];
  professionals: Professional[];
  horses: Horse[];
  onSave: (date: string, entries: BatchSessionEntry[]) => void;
}

const BatchSessionDialog: React.FC<BatchSessionDialogProps> = ({
  open,
  onOpenChange,
  patients,
  professionals,
  horses,
  onSave
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<BatchSessionEntry[]>([{
    patientId: 0,
    professionalId: 0,
    horseId: 0,
    time: '10:00'
  }]);
  
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return `${hour}:00`;
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const addEntry = () => {
    setEntries([...entries, {
      patientId: 0,
      professionalId: 0,
      horseId: 0,
      time: '10:00'
    }]);
  };

  const removeEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const updateEntry = (index: number, field: keyof BatchSessionEntry, value: any) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: field === 'time' ? value : parseInt(value)
    };
    setEntries(newEntries);
  };

  const handleSave = () => {
    // Validar que todos los campos estén completos
    const isValid = entries.every(entry => 
      entry.patientId && entry.professionalId && entry.horseId && entry.time
    );
    
    if (!isValid) {
      // Aquí podría mostrar un toast de error
      return;
    }
    
    onSave(format(date, 'yyyy-MM-dd'), entries);
    onOpenChange(false);
    
    // Restablecer el formulario
    setEntries([{
      patientId: 0,
      professionalId: 0,
      horseId: 0,
      time: '10:00'
    }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registro Masivo de Sesiones</DialogTitle>
          <DialogDescription>
            Programa múltiples sesiones para una misma fecha.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="date">Fecha para todas las sesiones</Label>
              <div className="mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Sesiones a programar</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEntry}
                className="text-xs h-8"
              >
                Agregar sesión
              </Button>
            </div>
            
            {entries.map((entry, index) => (
              <div key={index} className="p-3 border rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Sesión #{index + 1}</h4>
                  {entries.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeEntry(index)}
                      className="text-xs h-8 text-red-500"
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`patient-${index}`}>Paciente</Label>
                    <Select 
                      value={entry.patientId.toString()} 
                      onValueChange={(value) => updateEntry(index, 'patientId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.name} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`professional-${index}`}>Profesional</Label>
                    <Select 
                      value={entry.professionalId.toString()} 
                      onValueChange={(value) => updateEntry(index, 'professionalId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar profesional" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map(prof => (
                          <SelectItem key={prof.id} value={prof.id.toString()}>
                            {prof.name} {prof.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`horse-${index}`}>Caballo</Label>
                    <Select 
                      value={entry.horseId.toString()} 
                      onValueChange={(value) => updateEntry(index, 'horseId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar caballo" />
                      </SelectTrigger>
                      <SelectContent>
                        {horses.filter(h => h.availability).map(horse => (
                          <SelectItem key={horse.id} value={horse.id.toString()}>
                            {horse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`time-${index}`}>Horario</Label>
                    <Select 
                      value={entry.time} 
                      onValueChange={(value) => updateEntry(index, 'time', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSave}
            className="bg-equine-green-600 hover:bg-equine-green-700"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchSessionDialog;
