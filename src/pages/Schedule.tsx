import React from 'react';
import DateNavigation from '@/components/schedule/DateNavigation';
import SessionCalendar from '@/components/schedule/SessionCalendar';
import {
  AddSessionDialog,
  EditSessionDialog,
  DeleteSessionAlert
} from '@/components/schedule/ScheduleDialogs';
import BatchSessionDialog from '@/components/schedule/BatchSessionDialog';
import { useSessionCalendar } from '@/hooks/useSessionCalendar';
import { useScheduleState } from '@/hooks/schedule';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import ScheduleViewSelector from '@/components/schedule/ScheduleViewSelector';
import TimeSlotList from '@/components/schedule/TimeSlotList';

// Datos de ejemplo
const patients = [
  { id: 1, name: 'Juan', lastName: 'Pérez' },
  { id: 2, name: 'María', lastName: 'González' },
  { id: 3, name: 'Diego', lastName: 'Martínez' },
  { id: 4, name: 'Valentina', lastName: 'López' }
];

const professionals = [
  { id: 1, name: 'Ana', lastName: 'Silva' },
  { id: 2, name: 'Carlos', lastName: 'Rodríguez' },
  { id: 3, name: 'Laura', lastName: 'Torres' },
  { id: 4, name: 'Roberto', lastName: 'Méndez' }
];

const horses = [
  { id: 1, name: 'Luna', availability: true },
  { id: 2, name: 'Trueno', availability: true },
  { id: 3, name: 'Estrella', availability: true },
  { id: 4, name: 'Relámpago', availability: false },
  { id: 5, name: 'Tornado', availability: true }
];

const initialSessions = [
  {
    id: 1,
    date: '2025-04-09',
    time: '10:00',
    patientId: 1,
    patientName: 'Juan Pérez',
    professionalId: 1,
    professionalName: 'Ana Silva',
    horseId: 1,
    horseName: 'Luna'
  },
  {
    id: 2,
    date: '2025-04-09',
    time: '11:00',
    patientId: 2,
    patientName: 'María González',
    professionalId: 2,
    professionalName: 'Carlos Rodríguez',
    horseId: 2,
    horseName: 'Trueno'
  },
  {
    id: 3,
    date: '2025-04-09',
    time: '12:00',
    patientId: 3,
    patientName: 'Diego Martínez',
    professionalId: 3,
    professionalName: 'Laura Torres',
    horseId: 3,
    horseName: 'Estrella'
  },
  {
    id: 4,
    date: '2025-04-09',
    time: '16:00',
    patientId: 4,
    patientName: 'Valentina López',
    professionalId: 4,
    professionalName: 'Roberto Méndez',
    horseId: 5,
    horseName: 'Tornado'
  }
];

const Schedule = () => {
  const {
    displayView,
    setDisplayView,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    isBatchDialogOpen,
    setIsBatchDialogOpen,
    currentDate,
    selectedSession,
    sessions,
    newSession,
    setNewSession,
    editingSession,
    setEditingSession,
    timeSlots,
    navigateDate,
    handleAddSession,
    handleEditSession,
    handleUpdateSession,
    handleDeleteClick,
    handleDeleteSession,
    handleBatchAddSessions
  } = useScheduleState(initialSessions, patients, professionals, horses);

  const {
    viewType,
    calendarDays,
    handleNavigate: handleCalendarNavigate,
    handleDateClick,
    setViewType
  } = useSessionCalendar(sessions);

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

  return (
    <div className="container mx-auto px-4 py-6">
      <ScheduleHeader 
        onAddSession={() => setIsAddDialogOpen(true)}
        onBatchAdd={() => setIsBatchDialogOpen(true)}
      />

      <div className="mb-6">
        <ScheduleViewSelector
          displayView={displayView}
          onViewChange={setDisplayView}
          listContent={listContent}
          calendarContent={calendarContent}
        />
      </div>

      <AddSessionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newSession={newSession}
        onNewSessionChange={setNewSession}
        patients={patients}
        professionals={professionals}
        horses={horses}
        onSave={handleAddSession}
      />

      <EditSessionDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingSession={editingSession}
        onEditingSessionChange={setEditingSession}
        patients={patients}
        professionals={professionals}
        horses={horses}
        onSave={handleUpdateSession}
      />

      <DeleteSessionAlert
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        selectedSession={selectedSession}
        onDelete={handleDeleteSession}
      />

      <BatchSessionDialog
        open={isBatchDialogOpen}
        onOpenChange={setIsBatchDialogOpen}
        patients={patients}
        professionals={professionals}
        horses={horses}
        onSave={handleBatchAddSessions}
      />
    </div>
  );
};

export default Schedule;
