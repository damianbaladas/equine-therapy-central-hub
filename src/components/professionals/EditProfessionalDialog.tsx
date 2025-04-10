
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

interface Professional {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface EditProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProfessional: Professional;
  onEditProfessionalChange: (professional: Professional) => void;
  roles: string[];
  onSave: () => void;
}

const EditProfessionalDialog: React.FC<EditProfessionalDialogProps> = ({
  open,
  onOpenChange,
  editProfessional,
  onEditProfessionalChange,
  roles,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Profesional</DialogTitle>
          <DialogDescription>Modifique la información del profesional.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="edit-ci">Cédula de Identidad</Label>
            <Input 
              id="edit-ci" 
              value={editProfessional.ci}
              onChange={(e) => onEditProfessionalChange({...editProfessional, ci: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Nombre</Label>
            <Input 
              id="edit-name" 
              value={editProfessional.name}
              onChange={(e) => onEditProfessionalChange({...editProfessional, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-lastName">Apellido</Label>
            <Input 
              id="edit-lastName" 
              value={editProfessional.lastName}
              onChange={(e) => onEditProfessionalChange({...editProfessional, lastName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input 
              id="edit-email" 
              type="email"
              value={editProfessional.email}
              onChange={(e) => onEditProfessionalChange({...editProfessional, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Teléfono</Label>
            <Input 
              id="edit-phone" 
              value={editProfessional.phone}
              onChange={(e) => onEditProfessionalChange({...editProfessional, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="edit-role">Rol</Label>
            <Select 
              value={editProfessional.role} 
              onValueChange={(value) => onEditProfessionalChange({...editProfessional, role: value})}
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
          <Button onClick={onSave} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfessionalDialog;
