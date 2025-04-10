
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Session {
  id: number;
  date: string;
  time: string;
  patientId: number;
  patientName: string;
  professionalId: number;
  professionalName: string;
  horseId: number;
  horseName: string;
}

interface TimeSlot {
  time: string;
  sessions: Session[];
}

interface TimeSlotProps {
  slot: TimeSlot;
  onEdit: (session: Session) => void;
  onDelete: (session: Session) => void;
}

const TimeSlotComponent: React.FC<TimeSlotProps> = ({ slot, onEdit, onDelete }) => {
  return (
    <Card className="equine-card">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="w-24 font-medium">{slot.time}</div>
          <div className="flex-1">
            {slot.sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slot.sessions.map(session => (
                  <div key={session.id} className="bg-equine-green-50 p-4 rounded-md">
                    <div className="flex justify-between">
                      <p className="font-medium">{session.patientName}</p>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(session)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(session)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Profesional: {session.professionalName}</p>
                    <p className="text-sm text-muted-foreground">Caballo: {session.horseName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic text-center">
                No hay sesiones programadas para este horario
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotComponent;
