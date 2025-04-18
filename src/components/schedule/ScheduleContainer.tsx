
import React from 'react';
import { useSessionCalendar } from '@/hooks/useSessionCalendar';
import { useScheduleState } from '@/hooks/schedule';
import ScheduleHeader from './ScheduleHeader';
import ScheduleViewSelector from './ScheduleViewSelector';
import ScheduleView from './ScheduleView';
import {
  AddSessionDialog,
  EditSessionDialog,
  DeleteSessionAlert
} from './ScheduleDialogs';
import BatchSessionDialog from './BatchSessionDialog';
import { initialSessions, patients, professionals, horses } from '@/data/mockScheduleData';

const ScheduleContainer = () => {
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
          listContent={
            <ScheduleView
              displayView={displayView}
              currentDate={currentDate}
              timeSlots={timeSlots}
              calendarDays={calendarDays}
              viewType={viewType}
              handleCalendarNavigate={handleCalendarNavigate}
              handleDateClick={handleDateClick}
              navigateDate={navigateDate}
              handleEditSession={handleEditSession}
              handleDeleteClick={handleDeleteClick}
              setViewType={setViewType}
            />
          }
          calendarContent={
            <ScheduleView
              displayView={displayView}
              currentDate={currentDate}
              timeSlots={timeSlots}
              calendarDays={calendarDays}
              viewType={viewType}
              handleCalendarNavigate={handleCalendarNavigate}
              handleDateClick={handleDateClick}
              navigateDate={navigateDate}
              handleEditSession={handleEditSession}
              handleDeleteClick={handleDeleteClick}
              setViewType={setViewType}
            />
          }
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

export default ScheduleContainer;
