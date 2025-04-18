
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

export interface EditSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSession: {
    id: number;
    patientId: string;
    professionalId: string;
    horseId: string;
    date: string;
    time: string;
  };
  onEditingSessionChange: (session: {
    id: number;
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

export const EditSessionDialog: React.FC<EditSessionDialogProps> = ({
  open,
  onOpenChange,
  editingSession,
  onEditingSessionChange,
  patients,
  professionals,
  horses,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Sesión</DialogTitle>
          <DialogDescription>Modifique la información de la sesión programada.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div>
            <Label htmlFor="edit-date">Fecha</Label>
            <input 
              type="date" 
              id="edit-date"
              className="equine-input w-full"
              value={editingSession.date}
              onChange={(e) => onEditingSessionChange({...editingSession, date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-time">Hora</Label>
            <Select 
              value={editingSession.time} 
              onValueChange={(value) => onEditingSessionChange({...editingSession, time: value})}
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
            <Label htmlFor="edit-patient">Paciente</Label>
            <Select 
              value={editingSession.patientId} 
              onValueChange={(value) => onEditingSessionChange({...editingSession, patientId: value})}
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
            <Label htmlFor="edit-professional">Profesional</Label>
            <Select 
              value={editingSession.professionalId} 
              onValueChange={(value) => onEditingSessionChange({...editingSession, professionalId: value})}
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
            <Label htmlFor="edit-horse">Caballo</Label>
            <Select 
              value={editingSession.horseId} 
              onValueChange={(value) => onEditingSessionChange({...editingSession, horseId: value})}
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
          <Button onClick={onSave} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
