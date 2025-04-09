
import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date()));

  // Mock data
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

  // Time slots for the schedule (8 AM to 6 PM)
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
    // Validate session doesn't exceed horse limit
    const selectedDate = newSession.date;
    const selectedTime = newSession.time;
    const horseSessions = sessions.filter(
      s => s.date === selectedDate && s.horseId === parseInt(newSession.horseId)
    );
    
    if (horseSessions.length >= 4) {
      alert('Este caballo ya tiene el máximo de 4 sesiones para hoy.');
      return;
    }

    // Validate professional availability
    const professionalSessions = sessions.filter(
      s => s.date === selectedDate && s.time === selectedTime && s.professionalId === parseInt(newSession.professionalId)
    );

    if (professionalSessions.length > 0) {
      alert('El profesional ya tiene una sesión agendada para este horario.');
      return;
    }

    // Find names for the selected IDs
    const selectedPatient = patients.find(p => p.id === parseInt(newSession.patientId));
    const selectedProfessional = professionals.find(p => p.id === parseInt(newSession.professionalId));
    const selectedHorse = horses.find(h => h.id === parseInt(newSession.horseId));

    if (!selectedPatient || !selectedProfessional || !selectedHorse) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    if (!selectedHorse.availability) {
      alert('Este caballo no está disponible actualmente.');
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
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Agenda</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-equine-green-600 hover:bg-equine-green-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Sesión
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-medium">
              {currentDate.toLocaleDateString('es-UY', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <Card key={slot.time} className="equine-card">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-24 font-medium">{slot.time}</div>
                <div className="flex-1">
                  {slot.sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {slot.sessions.map(session => (
                        <div key={session.id} className="bg-equine-green-50 p-4 rounded-md">
                          <div className="flex justify-between">
                            <p className="font-medium">{session.patientName}</p>
                            <Button variant="ghost" size="sm">X</Button>
                          </div>
                          <p className="text-sm text-muted-foreground">Profesional: {session.professionalName}</p>
                          <p className="text-sm text-muted-foreground">Caballo: {session.horseName}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic text-center">
                      No hay sesiones programadas para este horario
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Session Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Programar Nueva Sesión</DialogTitle>
            <DialogDescription>Complete la información para agendar una nueva sesión.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <input 
                type="date" 
                id="date"
                className="equine-input w-full"
                value={newSession.date}
                onChange={(e) => setNewSession({...newSession, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Select 
                value={newSession.time} 
                onValueChange={(value) => setNewSession({...newSession, time: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const hour = i + 8;
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="patient">Paciente</Label>
              <Select 
                value={newSession.patientId} 
                onValueChange={(value) => setNewSession({...newSession, patientId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {`${patient.name} ${patient.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="professional">Profesional</Label>
              <Select 
                value={newSession.professionalId} 
                onValueChange={(value) => setNewSession({...newSession, professionalId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar profesional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id.toString()}>
                      {`${professional.name} ${professional.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="horse">Caballo</Label>
              <Select 
                value={newSession.horseId} 
                onValueChange={(value) => setNewSession({...newSession, horseId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar caballo" />
                </SelectTrigger>
                <SelectContent>
                  {horses.filter(h => h.availability).map((horse) => (
                    <SelectItem key={horse.id} value={horse.id.toString()}>
                      {horse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddSession} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
