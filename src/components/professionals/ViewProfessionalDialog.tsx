
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Professional {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface ViewProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
  onEdit: (professional: Professional) => void;
  getRoleColor: (role: string) => string;
}

const ViewProfessionalDialog: React.FC<ViewProfessionalDialogProps> = ({
  open,
  onOpenChange,
  professional,
  onEdit,
  getRoleColor
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Profesional</DialogTitle>
        </DialogHeader>
        {professional && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cédula de Identidad</h3>
                <p>{professional.ci}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nombre Completo</h3>
                <p>{professional.name} {professional.lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{professional.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                <p>{professional.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rol</h3>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getRoleColor(professional.role)}`}>
                  {professional.role}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium">Sesiones Programadas</h3>
              <div className="mt-2 space-y-2">
                <div className="bg-equine-green-50 p-4 rounded-md">
                  <p className="text-sm">Viernes, 12 de Mayo - 10:00 AM</p>
                  <p className="text-sm">Paciente: Juan Pérez</p>
                  <p className="text-sm">Caballo: Luna</p>
                </div>
                <div className="bg-equine-green-50 p-4 rounded-md">
                  <p className="text-sm">Viernes, 12 de Mayo - 11:00 AM</p>
                  <p className="text-sm">Paciente: María González</p>
                  <p className="text-sm">Caballo: Trueno</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button variant="outline" onClick={() => {
            if (professional) {
              onEdit(professional);
              onOpenChange(false);
            }
          }}>Editar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProfessionalDialog;
