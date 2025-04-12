
import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleHeaderProps {
  onAddSession: () => void;
  onBatchAdd: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ 
  onAddSession, 
  onBatchAdd 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-equine-green-700">Agenda</h1>
      <div className="flex space-x-2">
        <Button 
          onClick={onBatchAdd} 
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Registro Masivo
        </Button>
        <Button onClick={onAddSession} className="bg-equine-green-600 hover:bg-equine-green-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Sesión
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
