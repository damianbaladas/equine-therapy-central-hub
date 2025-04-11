
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Professional {
  id: number;
  name: string;
  lastName: string;
}

interface AddWorkHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newWorkHour: {
    professionalId: string;
    date: string;
    hours: number;
  };
  onNewWorkHourChange: (workHour: {
    professionalId: string;
    date: string;
    hours: number;
  }) => void;
  professionals: Professional[];
  onSave: () => void;
}

const AddWorkHoursDialog: React.FC<AddWorkHoursDialogProps> = ({
  open,
  onOpenChange,
  newWorkHour,
  onNewWorkHourChange,
  professionals,
  onSave,
}) => {
  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onNewWorkHourChange({
        ...newWorkHour,
        date: format(date, 'yyyy-MM-dd')
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Horas Trabajadas</DialogTitle>
          <DialogDescription>
            Ingresa las horas trabajadas para el profesional.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="professional" className="text-right">
              Profesional
            </Label>
            <Select 
              value={newWorkHour.professionalId} 
              onValueChange={value => onNewWorkHourChange({...newWorkHour, professionalId: value})}
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
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newWorkHour.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newWorkHour.date ? (
                      format(new Date(newWorkHour.date), "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newWorkHour.date ? new Date(newWorkHour.date) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
              value={newWorkHour.hours}
              onChange={e => onNewWorkHourChange({...newWorkHour, hours: parseInt(e.target.value)})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkHoursDialog;
