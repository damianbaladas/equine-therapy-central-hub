
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Session, Patient, Professional, Horse } from '@/types/professionals';
import { format } from 'date-fns';

export const useScheduleState = (
  initialSessions: Session[],
  patients: Patient[],
  professionals: Professional[],
  horses: Horse[]
) => {
  const { toast } = useToast();
  const [displayView, setDisplayView] = useState<'list' | 'calendar'>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const [newSession, setNewSession] = useState({
    patientId: '',
    professionalId: '',
    horseId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00'
  });

  const [editingSession, setEditingSession] = useState({
    id: 0,
    patientId: '',
    professionalId: '',
    horseId: '',
    date: '',
    time: ''
  });

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleAddSession = () => {
    const selectedDate = newSession.date;
    const selectedTime = newSession.time;
    const horseSessions = sessions.filter(
      s => s.date === selectedDate && s.horseId === parseInt(newSession.horseId)
    );
    
    if (horseSessions.length >= 4) {
      toast({
        title: "Error",
        description: "Este caballo ya tiene el máximo de 4 sesiones para hoy.",
        variant: "destructive"
      });
      return;
    }

    const professionalSessions = sessions.filter(
      s => s.date === selectedDate && s.time === selectedTime && s.professionalId === parseInt(newSession.professionalId)
    );

    if (professionalSessions.length > 0) {
      toast({
        title: "Error",
        description: "El profesional ya tiene una sesión agendada para este horario.",
        variant: "destructive"
      });
      return;
    }

    const selectedPatient = patients.find(p => p.id === parseInt(newSession.patientId));
    const selectedProfessional = professionals.find(p => p.id === parseInt(newSession.professionalId));
    const selectedHorse = horses.find(h => h.id === parseInt(newSession.horseId));

    if (!selectedPatient || !selectedProfessional || !selectedHorse) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedHorse.availability) {
      toast({
        title: "Error",
        description: "Este caballo no está disponible actualmente.",
        variant: "destructive"
      });
      return;
    }

    const id = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1;
    const session: Session = {
      id,
      date: newSession.date,
      time: newSession.time,
      patientId: parseInt(newSession.patientId),
      patientName: `${selectedPatient.name} ${selectedPatient.lastName}`,
      professionalId: parseInt(newSession.professionalId),
      professionalName: `${selectedProfessional.name} ${selectedProfessional.lastName}`,
      horseId: parseInt(newSession.horseId),
      horseName: selectedHorse.name
    };

    setSessions([...sessions, session]);
    setIsAddDialogOpen(false);
    setNewSession({
      patientId: '',
      professionalId: '',
      horseId: '',
      date: formatDate(currentDate),
      time: '10:00'
    });

    toast({
      title: "Sesión agendada",
      description: `Se ha programado una sesión para ${selectedPatient.name} ${selectedPatient.lastName} con éxito.`,
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
    const selectedDate = editingSession.date;
    const selectedTime = editingSession.time;
    const professionalSessions = sessions.filter(
      s => s.date === selectedDate && 
          s.time === selectedTime && 
          s.professionalId === parseInt(editingSession.professionalId) &&
          s.id !== editingSession.id
    );

    if (professionalSessions.length > 0) {
      toast({
        title: "Error",
        description: "El profesional ya tiene una sesión agendada para este horario.",
        variant: "destructive"
      });
      return;
    }

    const selectedPatient = patients.find(p => p.id === parseInt(editingSession.patientId));
    const selectedProfessional = professionals.find(p => p.id === parseInt(editingSession.professionalId));
    const selectedHorse = horses.find(h => h.id === parseInt(editingSession.horseId));

    if (!selectedPatient || !selectedProfessional || !selectedHorse) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedHorse.availability) {
      toast({
        title: "Error",
        description: "Este caballo no está disponible actualmente.",
        variant: "destructive"
      });
      return;
    }

    const updatedSession: Session = {
      id: editingSession.id,
      date: editingSession.date,
      time: editingSession.time,
      patientId: parseInt(editingSession.patientId),
      patientName: `${selectedPatient.name} ${selectedPatient.lastName}`,
      professionalId: parseInt(editingSession.professionalId),
      professionalName: `${selectedProfessional.name} ${selectedProfessional.lastName}`,
      horseId: parseInt(editingSession.horseId),
      horseName: selectedHorse.name
    };

    setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
    setIsEditDialogOpen(false);

    toast({
      title: "Sesión actualizada",
      description: `La sesión de ${selectedPatient.name} ${selectedPatient.lastName} ha sido actualizada con éxito.`,
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
    timeSlots: Array.from({ length: 10 }, (_, i) => {
      const hour = i + 8;
      const time = `${hour}:00`;
      return {
        time,
        sessions: sessions.filter(s => s.date === formatDate(currentDate) && s.time === time)
      };
    }),
    navigateDate,
    handleAddSession,
    handleEditSession,
    handleUpdateSession,
    handleDeleteClick,
    handleDeleteSession,
    handleBatchAddSessions
  };
};
