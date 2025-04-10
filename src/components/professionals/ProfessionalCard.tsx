
import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Professional {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  onView: (professional: Professional) => void;
  onEdit: (professional: Professional) => void;
  onDelete: (id: number) => void;
  getRoleColor: (role: string) => string;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  professional, 
  onView, 
  onEdit, 
  onDelete,
  getRoleColor 
}) => {
  return (
    <Card className="equine-card">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{professional.name} {professional.lastName}</h3>
            <p className="text-sm text-muted-foreground">CI: {professional.ci}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getRoleColor(professional.role)}`}>
              {professional.role}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView(professional)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(professional)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(professional.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm"><strong>Email:</strong> {professional.email}</p>
          <p className="text-sm"><strong>Teléfono:</strong> {professional.phone}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onView(professional)}>
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
