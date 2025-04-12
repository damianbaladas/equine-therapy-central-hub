
import React from 'react';

const WeekDaysHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
        <div key={index} className="text-center text-sm font-medium py-1">
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekDaysHeader;
