
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Professional {
  id: number;
  name: string;
  lastName: string;
}

interface ProfessionalHourEntry {
  professionalId: number;
  selected: boolean;
  hours: number;
}

interface BatchWorkHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionals: Professional[];
  onSave: (date: string, entries: { professionalId: number, hours: number }[]) => void;
}

const BatchWorkHoursDialog: React.FC<BatchWorkHoursDialogProps> = ({
  open,
  onOpenChange,
  professionals,
  onSave,
}) => {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState<string>('');
  const [entries, setEntries] = useState<ProfessionalHourEntry[]>(
    professionals.map(p => ({
      professionalId: p.id,
      selected: false,
      hours: 8,
    }))
  );

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  const handleToggleSelect = (professionalId: number) => {
    setEntries(prev => prev.map(entry => 
      entry.professionalId === professionalId 
        ? { ...entry, selected: !entry.selected }
        : entry
    ));
  };

  const handleHoursChange = (professionalId: number, hours: number) => {
    setEntries(prev => prev.map(entry => 
      entry.professionalId === professionalId 
        ? { ...entry, hours }
        : entry
    ));
  };

  const handleSelectAll = () => {
    const allSelected = entries.every(entry => entry.selected);
    setEntries(prev => prev.map(entry => ({
      ...entry,
      selected: !allSelected
    })));
  };

  const handleSetHoursForAll = (hours: number) => {
    setEntries(prev => prev.map(entry => entry.selected ? {
      ...entry,
      hours
    } : entry));
  };

  const handleSave = () => {
    const selectedEntries = entries
      .filter(entry => entry.selected)
      .map(({ professionalId, hours }) => ({ professionalId, hours }));
    
    if (selectedEntries.length > 0) {
      onSave(date, selectedEntries);
      onOpenChange(false);
    }
  };

  const selectedProfessionalsCount = entries.filter(entry => entry.selected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registro Masivo de Horas</DialogTitle>
          <DialogDescription>
            Registra horas de trabajo para múltiples profesionales en una misma fecha.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
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
                        format(new Date(date), "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date ? new Date(date) : undefined}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label>Acciones en grupo</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleSelectAll}
                >
                  {entries.every(entry => entry.selected) ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={() => handleSetHoursForAll(8)}
                  disabled={selectedProfessionalsCount === 0}
                >
                  8h
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={() => handleSetHoursForAll(4)}
                  disabled={selectedProfessionalsCount === 0}
                >
                  4h
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={entries.length > 0 && entries.every(entry => entry.selected)}
                  onCheckedChange={handleSelectAll}
                  className="mr-2"
                />
                <Label htmlFor="select-all" className="font-medium">Profesional</Label>
              </div>
              <div className="w-24 text-center">
                <Label>Horas</Label>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
              {professionals.map((professional) => {
                const entry = entries.find(e => e.professionalId === professional.id);
                if (!entry) return null;
                
                return (
                  <div key={professional.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Checkbox
                        id={`prof-${professional.id}`}
                        checked={entry.selected}
                        onCheckedChange={() => handleToggleSelect(professional.id)}
                        className="mr-2"
                      />
                      <Label htmlFor={`prof-${professional.id}`} className="cursor-pointer">
                        {professional.name} {professional.lastName}
                      </Label>
                    </div>
                    <div className="flex items-center w-24">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => entry.selected && handleHoursChange(professional.id, Math.max(0, entry.hours - 1))}
                        disabled={!entry.selected}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        value={entry.hours}
                        onChange={(e) => handleHoursChange(professional.id, parseInt(e.target.value) || 0)}
                        disabled={!entry.selected}
                        className="h-7 mx-1 w-12 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => entry.selected && handleHoursChange(professional.id, Math.min(24, entry.hours + 1))}
                        disabled={!entry.selected}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añadir notas sobre estas horas de trabajo..."
              className="mt-1"
            />
          </div>
          
          {selectedProfessionalsCount > 0 && (
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <span className="font-medium">Resumen:</span>
              <Badge variant="outline" className="font-medium">
                {selectedProfessionalsCount} profesionales seleccionados
              </Badge>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={selectedProfessionalsCount === 0}
            className="bg-equine-green-600 hover:bg-equine-green-700"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchWorkHoursDialog;
