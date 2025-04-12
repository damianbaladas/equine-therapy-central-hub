
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DayHeaderProps {
  currentDate: Date;
}

const DayHeader: React.FC<DayHeaderProps> = ({ currentDate }) => {
  return (
    <div className="mb-4 text-center">
      <h3 className="text-lg font-medium">
        {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
      </h3>
    </div>
  );
};

export default DayHeader;
