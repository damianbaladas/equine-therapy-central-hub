
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Patient {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  age: number;
  phone: string;
  email: string;
  parents: string;
  medicalHistory: string;
  progress: string;
  observations: string;
}

export interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPatient: Omit<Patient, 'id'>;
  onNewPatientChange: (patient: Omit<Patient, 'id'>) => void;
  onSave: () => void;
}

export const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  open,
  onOpenChange,
  newPatient,
  onNewPatientChange,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
          <DialogDescription>Complete la información del paciente.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="ci">Cédula de Identidad</Label>
            <Input 
              id="ci" 
              value={newPatient.ci}
              onChange={(e) => onNewPatientChange({...newPatient, ci: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              value={newPatient.name}
              onChange={(e) => onNewPatientChange({...newPatient, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input 
              id="lastName" 
              value={newPatient.lastName}
              onChange={(e) => onNewPatientChange({...newPatient, lastName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="age">Edad</Label>
            <Input 
              id="age" 
              type="number"
              value={newPatient.age.toString()}
              onChange={(e) => onNewPatientChange({...newPatient, age: parseInt(e.target.value) || 0})}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input 
              id="phone" 
              value={newPatient.phone}
              onChange={(e) => onNewPatientChange({...newPatient, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={newPatient.email}
              onChange={(e) => onNewPatientChange({...newPatient, email: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="parents">Padres</Label>
            <Input 
              id="parents" 
              value={newPatient.parents}
              onChange={(e) => onNewPatientChange({...newPatient, parents: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="medicalHistory">Historial Médico</Label>
            <Textarea 
              id="medicalHistory" 
              rows={3}
              value={newPatient.medicalHistory}
              onChange={(e) => onNewPatientChange({...newPatient, medicalHistory: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="progress">Progreso de la Terapia</Label>
            <Textarea 
              id="progress" 
              rows={3}
              value={newPatient.progress}
              onChange={(e) => onNewPatientChange({...newPatient, progress: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea 
              id="observations" 
              rows={3}
              value={newPatient.observations}
              onChange={(e) => onNewPatientChange({...newPatient, observations: e.target.value})}
            />
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

export interface ViewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onEdit: (patient: Patient) => void;
}

export const ViewPatientDialog: React.FC<ViewPatientDialogProps> = ({
  open,
  onOpenChange,
  patient,
  onEdit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Paciente</DialogTitle>
        </DialogHeader>
        {patient && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cédula de Identidad</h3>
                <p>{patient.ci}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nombre Completo</h3>
                <p>{patient.name} {patient.lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Edad</h3>
                <p>{patient.age} años</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                <p>{patient.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{patient.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Padres</h3>
                <p>{patient.parents}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Historial Médico</h3>
              <p className="mt-1 whitespace-pre-wrap">{patient.medicalHistory}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Progreso de la Terapia</h3>
              <p className="mt-1 whitespace-pre-wrap">{patient.progress}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Observaciones</h3>
              <p className="mt-1 whitespace-pre-wrap">{patient.observations}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium">Próximas Sesiones</h3>
              <div className="mt-2">
                <div className="bg-equine-green-50 p-4 rounded-md">
                  <p className="text-sm">Viernes, 12 de Mayo - 10:00 AM</p>
                  <p className="text-sm">Profesional: Ana Silva</p>
                  <p className="text-sm">Caballo: Luna</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button variant="outline" onClick={() => {
            if (patient) {
              onEdit(patient);
              onOpenChange(false);
            }
          }}>Editar</Button>
          <Button className="bg-equine-green-600 hover:bg-equine-green-700">Agendar Sesión</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onPatientChange: (patient: Patient) => void;
  onSave: () => void;
}

export const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  open,
  onOpenChange,
  patient,
  onPatientChange,
  onSave
}) => {
  if (!patient) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
          <DialogDescription>Modifique la información del paciente.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="edit-ci">Cédula de Identidad</Label>
            <Input 
              id="edit-ci" 
              value={patient.ci}
              onChange={(e) => onPatientChange({...patient, ci: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Nombre</Label>
            <Input 
              id="edit-name" 
              value={patient.name}
              onChange={(e) => onPatientChange({...patient, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-lastName">Apellido</Label>
            <Input 
              id="edit-lastName" 
              value={patient.lastName}
              onChange={(e) => onPatientChange({...patient, lastName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-age">Edad</Label>
            <Input 
              id="edit-age" 
              type="number"
              value={patient.age.toString()}
              onChange={(e) => onPatientChange({...patient, age: parseInt(e.target.value) || 0})}
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Teléfono</Label>
            <Input 
              id="edit-phone" 
              value={patient.phone}
              onChange={(e) => onPatientChange({...patient, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input 
              id="edit-email" 
              type="email"
              value={patient.email}
              onChange={(e) => onPatientChange({...patient, email: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="edit-parents">Padres</Label>
            <Input 
              id="edit-parents" 
              value={patient.parents}
              onChange={(e) => onPatientChange({...patient, parents: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="edit-medicalHistory">Historial Médico</Label>
            <Textarea 
              id="edit-medicalHistory" 
              rows={3}
              value={patient.medicalHistory}
              onChange={(e) => onPatientChange({...patient, medicalHistory: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="edit-progress">Progreso de la Terapia</Label>
            <Textarea 
              id="edit-progress" 
              rows={3}
              value={patient.progress}
              onChange={(e) => onPatientChange({...patient, progress: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="edit-observations">Observaciones</Label>
            <Textarea 
              id="edit-observations" 
              rows={3}
              value={patient.observations}
              onChange={(e) => onPatientChange({...patient, observations: e.target.value})}
            />
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
