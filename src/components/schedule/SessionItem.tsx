
import React from 'react';
import { Session } from '@/types/professionals';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SessionItemProps {
  session: Session;
}

const SessionItem: React.FC<SessionItemProps> = ({ session }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="px-1 py-0.5 bg-equine-green-50 border border-equine-green-200 rounded text-xs truncate">
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
