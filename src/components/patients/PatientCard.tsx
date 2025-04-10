
import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface PatientCardProps {
  patient: Patient;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onView, onEdit, onDelete }) => {
  return (
    <Card className="equine-card">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{patient.name} {patient.lastName}</h3>
            <p className="text-sm text-muted-foreground">CI: {patient.ci}</p>
            <p className="text-sm text-muted-foreground">Edad: {patient.age} años</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView(patient)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(patient)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(patient.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm"><strong>Teléfono:</strong> {patient.phone}</p>
          <p className="text-sm"><strong>Email:</strong> {patient.email}</p>
          <p className="text-sm truncate"><strong>Padres:</strong> {patient.parents}</p>
          <p className="text-sm mt-2 line-clamp-2"><strong>Observaciones:</strong> {patient.observations}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onView(patient)}>
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
