
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient, Professional, Horse } from '@/types/professionals';

export interface AddSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newSession: {
    patientId: string;
    professionalId: string;
    horseId: string;
    date: string;
    time: string;
  };
  onNewSessionChange: (session: {
    patientId: string;
    professionalId: string;
    horseId: string;
    date: string;
    time: string;
  }) => void;
  patients: Patient[];
  professionals: Professional[];
  horses: Horse[];
  onSave: () => void;
}

export const AddSessionDialog: React.FC<AddSessionDialogProps> = ({
  open,
  onOpenChange,
  newSession,
  onNewSessionChange,
  patients,
  professionals,
  horses,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Programar Nueva Sesión</DialogTitle>
          <DialogDescription>Complete la información para agendar una nueva sesión.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <input 
              type="date" 
              id="date"
              className="equine-input w-full"
              value={newSession.date}
              onChange={(e) => onNewSessionChange({...newSession, date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="time">Hora</Label>
            <Select 
              value={newSession.time} 
              onValueChange={(value) => onNewSessionChange({...newSession, time: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar hora" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const hour = i + 8;
                  return (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {`${hour}:00`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="patient">Paciente</Label>
            <Select 
              value={newSession.patientId} 
              onValueChange={(value) => onNewSessionChange({...newSession, patientId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {`${patient.name} ${patient.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="professional">Profesional</Label>
            <Select 
              value={newSession.professionalId} 
              onValueChange={(value) => onNewSessionChange({...newSession, professionalId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar profesional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id.toString()}>
                    {`${professional.name} ${professional.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="horse">Caballo</Label>
            <Select 
              value={newSession.horseId} 
              onValueChange={(value) => onNewSessionChange({...newSession, horseId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar caballo" />
              </SelectTrigger>
              <SelectContent>
                {horses.filter(h => h.availability).map((horse) => (
                  <SelectItem key={horse.id} value={horse.id.toString()}>
                    {horse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
