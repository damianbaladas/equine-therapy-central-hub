
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

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newRole: string;
  onNewRoleChange: (value: string) => void;
  onSave: () => void;
}

const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onOpenChange,
  newRole,
  onNewRoleChange,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Rol</DialogTitle>
          <DialogDescription>Ingrese el nombre del nuevo rol.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="roleName">Nombre del Rol</Label>
          <Input 
            id="roleName" 
            value={newRole}
            onChange={(e) => onNewRoleChange(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
