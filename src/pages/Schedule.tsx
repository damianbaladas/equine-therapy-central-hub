import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import TimeSlotComponent from '@/components/schedule/TimeSlot';
import DateNavigation from '@/components/schedule/DateNavigation';
import { 
  AddSessionDialog, 
  EditSessionDialog, 
  DeleteSessionAlert 
} from '@/components/schedule/ScheduleDialogs';

interface Session {
  id: number;
  date: string;
  time: string;
  patientId: number;
  patientName: string;
  professionalId: number;
  professionalName: string;
  horseId: number;
  horseName: string;
}

interface TimeSlot {
  time: string;
  sessions: Session[];
}

interface Patient {
  id: number;
  name: string;
  lastName: string;
}

interface Professional {
  id: number;
  name: string;
  lastName: string;
}

interface Horse {
  id: number;
  name: string;
  availability: boolean;
}

const Schedule = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const patients: Patient[] = [
    { id: 1, name: 'Juan', lastName: 'Pérez' },
    { id: 2, name: 'María', lastName: 'González' },
    { id: 3, name: 'Diego', lastName: 'Martínez' },
    { id: 4, name: 'Valentina', lastName: 'López' }
  ];

  const professionals: Professional[] = [
    { id: 1, name: 'Ana', lastName: 'Silva' },
    { id: 2, name: 'Carlos', lastName: 'Rodríguez' },
    { id: 3, name: 'Laura', lastName: 'Torres' },
    { id: 4, name: 'Roberto', lastName: 'Méndez' }
  ];

  const horses: Horse[] = [
    { id: 1, name: 'Luna', availability: true },
    { id: 2, name: 'Trueno', availability: true },
    { id: 3, name: 'Estrella', availability: true },
    { id: 4, name: 'Relámpago', availability: false },
    { id: 5, name: 'Tornado', availability: true }
  ];

  const [sessions, setSessions] = useState<Session[]>([
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
  ]);

  const [newSession, setNewSession] = useState({
    patientId: '',
    professionalId: '',
    horseId: '',
    date: format(new Date()),
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

  const timeSlots: TimeSlot[] = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    const time = `${hour}:00`;
    return {
      time,
      sessions: sessions.filter(s => s.date === format(currentDate) && s.time === time)
    };
  });

  function format(date: Date): string {
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
      date: format(currentDate),
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Agenda</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-equine-green-600 hover:bg-equine-green-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Sesión
        </Button>
      </div>

      <DateNavigation
        currentDate={currentDate}
        onNavigate={navigateDate}
      />

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <TimeSlotComponent
            key={slot.time}
            slot={slot}
            onEdit={handleEditSession}
            onDelete={handleDeleteClick}
          />
        ))}
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
    </div>
  );
};

export default Schedule;
