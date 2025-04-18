
import React from 'react';
import DateNavigation from './DateNavigation';
import { TimeSlotList } from './TimeSlotList';
import SessionCalendar from './SessionCalendar';
import { CalendarViewType } from '@/hooks/calendar/types';
import { Session } from '@/types/professionals';

interface ScheduleViewProps {
  displayView: 'list' | 'calendar';
  currentDate: Date;
  timeSlots: Array<{ time: string; sessions: Session[] }>;
  calendarDays: any[];
  viewType: CalendarViewType;
  handleCalendarNavigate: (direction: 'prev' | 'next') => void;
  handleDateClick: (date: Date) => void;
  navigateDate: (direction: 'prev' | 'next') => void;
  handleEditSession: (session: Session) => void;
  handleDeleteClick: (session: Session) => void;
  setViewType: (viewType: CalendarViewType) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  displayView,
  currentDate,
  timeSlots,
  calendarDays,
  viewType,
  handleCalendarNavigate,
  handleDateClick,
  navigateDate,
  handleEditSession,
  handleDeleteClick,
  setViewType
}) => {
  const listContent = (
    <>
      <DateNavigation
        currentDate={currentDate}
        onNavigate={navigateDate}
      />
      <TimeSlotList
        timeSlots={timeSlots}
        onEdit={handleEditSession}
        onDelete={handleDeleteClick}
      />
    </>
  );

  const calendarContent = (
    <>
      <DateNavigation
        currentDate={currentDate}
        onNavigate={handleCalendarNavigate}
        viewType={viewType}
        onViewChange={setViewType}
      />
      <SessionCalendar
        calendarDays={calendarDays}
        viewType={viewType}
        onDateClick={handleDateClick}
        currentDate={currentDate}
        onEditSession={handleEditSession}
      />
    </>
  );

  return displayView === 'list' ? listContent : calendarContent;
};

export default ScheduleView;
