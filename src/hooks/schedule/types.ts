
import { Session, Patient, Professional, Horse } from '@/types/professionals';

export interface NewSessionData {
  patientId: string;
  professionalId: string;
  horseId: string;
  date: string;
  time: string;
}

export interface EditingSessionData extends NewSessionData {
  id: number;
}

export interface TimeSlot {
  time: string;
  sessions: Session[];
}

export interface ScheduleState {
  displayView: 'list' | 'calendar';
  setDisplayView: (view: 'list' | 'calendar') => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteAlertOpen: boolean;
  setIsDeleteAlertOpen: (open: boolean) => void;
  isBatchDialogOpen: boolean;
  setIsBatchDialogOpen: (open: boolean) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedSession: Session | null;
  sessions: Session[];
  newSession: NewSessionData;
  setNewSession: (session: NewSessionData) => void;
  editingSession: EditingSessionData;
  setEditingSession: (session: EditingSessionData) => void;
  timeSlots: TimeSlot[];
  navigateDate: (direction: 'prev' | 'next') => void;
  handleAddSession: () => void;
  handleEditSession: (session: Session) => void;
  handleUpdateSession: () => void;
  handleDeleteClick: (session: Session) => void;
  handleDeleteSession: () => void;
  handleBatchAddSessions: (date: string, entries: Array<{patientId: number, professionalId: number, horseId: number, time: string}>) => void;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
