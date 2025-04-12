
import React from 'react';
import TimeSlotComponent from '@/components/schedule/TimeSlot';
import { Session } from '@/types/professionals';

interface TimeSlotListProps {
  timeSlots: Array<{
    time: string;
    sessions: Session[];
  }>;
  onEdit: (session: Session) => void;
  onDelete: (session: Session) => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  timeSlots,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {timeSlots.map((slot) => (
        <TimeSlotComponent
          key={slot.time}
          slot={slot}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TimeSlotList;
