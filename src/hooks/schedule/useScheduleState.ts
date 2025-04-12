
import { useState } from 'react';
import { Session, Patient, Professional, Horse } from '@/types/professionals';
import { format } from 'date-fns';
import { 
  NewSessionData, 
  EditingSessionData, 
  ScheduleState, 
  formatDate 
} from './types';
import { useSessionUtils } from './sessionUtils';

export const useScheduleState = (
  initialSessions: Session[],
  patients: Patient[],
  professionals: Professional[],
  horses: Horse[]
): ScheduleState => {
  // Estados básicos
  const [displayView, setDisplayView] = useState<'list' | 'calendar'>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  // Estados para formularios
  const [newSession, setNewSession] = useState<NewSessionData>({
    patientId: '',
    professionalId: '',
    horseId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00'
  });

  const [editingSession, setEditingSession] = useState<EditingSessionData>({
    id: 0,
    patientId: '',
    professionalId: '',
    horseId: '',
    date: '',
    time: ''
  });

  // Utilidades para sesiones
  const { 
    validateSessionData, 
    createSessionObject, 
    generateTimeSlots, 
    toast 
  } = useSessionUtils(sessions, patients, professionals, horses);

  // Funciones de navegación
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Funciones para manipulación de sesiones
  const handleAddSession = () => {
    if (!validateSessionData(
      newSession.patientId, 
      newSession.professionalId, 
      newSession.horseId, 
      newSession.date, 
      newSession.time
    )) {
      return;
    }

    const session = createSessionObject(newSession);
    if (!session) return;

    setSessions([...sessions, session]);
    setIsAddDialogOpen(false);
    setNewSession({
      patientId: '',
      professionalId: '',
      horseId: '',
      date: formatDate(currentDate),
      time: '10:00'
    });

    const patientName = patients.find(p => p.id === parseInt(newSession.patientId))?.name || '';
    const patientLastName = patients.find(p => p.id === parseInt(newSession.patientId))?.lastName || '';

    toast({
      title: "Sesión agendada",
      description: `Se ha programado una sesión para ${patientName} ${patientLastName} con éxito.`,
    });
  };

  const handleEditSession = (session: Session) => {
    setEditingSession({
      id: session.id,
      patientId: session.patientId.toString(),
      professionalId: session.professionalId.toString(),
      horseId: session.horseId.toString(),
      date: session.date,
      time: session.time
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSession = () => {
    if (!validateSessionData(
      editingSession.patientId, 
      editingSession.professionalId, 
      editingSession.horseId, 
      editingSession.date, 
      editingSession.time,
      editingSession.id
    )) {
      return;
    }

    const updatedSession = createSessionObject(editingSession, false);
    if (!updatedSession) return;

    setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
    setIsEditDialogOpen(false);

    const patientName = patients.find(p => p.id === parseInt(editingSession.patientId))?.name || '';
    const patientLastName = patients.find(p => p.id === parseInt(editingSession.patientId))?.lastName || '';

    toast({
      title: "Sesión actualizada",
      description: `La sesión de ${patientName} ${patientLastName} ha sido actualizada con éxito.`,
    });
  };

  const handleDeleteClick = (session: Session) => {
    setSelectedSession(session);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteSession = () => {
    if (!selectedSession) return;

    setSessions(sessions.filter(s => s.id !== selectedSession.id));
    setIsDeleteAlertOpen(false);

    toast({
      title: "Sesión eliminada",
      description: `La sesión de ${selectedSession.patientName} ha sido eliminada del calendario.`,
      variant: "destructive",
    });
  };

  const handleBatchAddSessions = (date: string, entries: Array<{patientId: number, professionalId: number, horseId: number, time: string}>) => {
    const newSessions: Session[] = entries.map((entry, index) => {
      const patient = patients.find(p => p.id === entry.patientId);
      const professional = professionals.find(p => p.id === entry.professionalId);
      const horse = horses.find(h => h.id === entry.horseId);
      
      if (!patient || !professional || !horse) return null;

      const id = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 + index : 1 + index;
      
      return {
        id,
        date,
        time: entry.time,
        patientId: entry.patientId,
        patientName: `${patient.name} ${patient.lastName}`,
        professionalId: entry.professionalId,
        professionalName: `${professional.name} ${professional.lastName}`,
        horseId: entry.horseId,
        horseName: horse.name
      };
    }).filter(Boolean) as Session[];

    if (newSessions.length === 0) return;
    
    setSessions([...sessions, ...newSessions]);
    
    toast({
      title: "Sesiones agendadas en lote",
      description: `Se han programado ${newSessions.length} sesiones con éxito.`,
    });
  };

  return {
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
    setCurrentDate,
    selectedSession,
    sessions,
    newSession,
    setNewSession,
    editingSession,
    setEditingSession,
    timeSlots: generateTimeSlots(currentDate),
    navigateDate,
    handleAddSession,
    handleEditSession,
    handleUpdateSession,
    handleDeleteClick,
    handleDeleteSession,
    handleBatchAddSessions
  };
};
