
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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProfessional: Omit<Professional, 'id'>;
  onNewProfessionalChange: (professional: Omit<Professional, 'id'>) => void;
  roles: string[];
  onSave: () => void;
}

interface Professional {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

const AddProfessionalDialog: React.FC<AddProfessionalDialogProps> = ({
  open,
  onOpenChange,
  newProfessional,
  onNewProfessionalChange,
  roles,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Profesional</DialogTitle>
          <DialogDescription>Complete la información del profesional.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="ci">Cédula de Identidad</Label>
            <Input 
              id="ci" 
              value={newProfessional.ci}
              onChange={(e) => onNewProfessionalChange({...newProfessional, ci: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              value={newProfessional.name}
              onChange={(e) => onNewProfessionalChange({...newProfessional, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input 
              id="lastName" 
              value={newProfessional.lastName}
              onChange={(e) => onNewProfessionalChange({...newProfessional, lastName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={newProfessional.email}
              onChange={(e) => onNewProfessionalChange({...newProfessional, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input 
              id="phone" 
              value={newProfessional.phone}
              onChange={(e) => onNewProfessionalChange({...newProfessional, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="role">Rol</Label>
            <Select 
              value={newProfessional.role} 
              onValueChange={(value) => onNewProfessionalChange({...newProfessional, role: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
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

export default AddProfessionalDialog;
