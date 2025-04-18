
import React from 'react';
import { Session } from '@/types/professionals';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SessionItemProps {
  session: Session;
  onEdit?: (session: Session) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onEdit }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent calendar day click when clicking session
    if (onEdit) {
      onEdit(session);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="px-1 py-0.5 bg-equine-green-50 border border-equine-green-200 rounded text-xs truncate cursor-pointer hover:bg-equine-green-100"
          onClick={handleClick}
        >
          {session.time} - {session.patientName}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div><strong>{session.patientName}</strong></div>
          <div>Hora: {session.time}</div>
          <div>Prof: {session.professionalName}</div>
          <div>Caballo: {session.horseName}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default SessionItem;
