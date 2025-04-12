
import { format } from 'date-fns';
import { Session, Patient, Professional, Horse } from '@/types/professionals';
import { NewSessionData, EditingSessionData, formatDate } from './types';
import { useToast } from '@/hooks/use-toast';

export function useSessionUtils(
  sessions: Session[],
  patients: Patient[],
  professionals: Professional[],
  horses: Horse[]
) {
  const { toast } = useToast();

  const validateHorseAvailability = (
    horseId: string, 
    selectedDate: string, 
    excludeSessionId?: number
  ): boolean => {
    const selectedHorse = horses.find(h => h.id === parseInt(horseId));
    
    if (!selectedHorse?.availability) {
      toast({
        title: "Error",
        description: "Este caballo no está disponible actualmente.",
        variant: "destructive"
      });
      return false;
    }

    const horseSessions = sessions.filter(
      s => s.date === selectedDate && s.horseId === parseInt(horseId) && 
      (excludeSessionId === undefined || s.id !== excludeSessionId)
    );
    
    if (horseSessions.length >= 4) {
      toast({
        title: "Error",
        description: "Este caballo ya tiene el máximo de 4 sesiones para hoy.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateProfessionalAvailability = (
    professionalId: string,
    selectedDate: string,
    selectedTime: string,
    excludeSessionId?: number
  ): boolean => {
    const professionalSessions = sessions.filter(
      s => s.date === selectedDate && 
          s.time === selectedTime && 
          s.professionalId === parseInt(professionalId) &&
          (excludeSessionId === undefined || s.id !== excludeSessionId)
    );

    if (professionalSessions.length > 0) {
      toast({
        title: "Error",
        description: "El profesional ya tiene una sesión agendada para este horario.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateSessionData = (
    patientId: string,
    professionalId: string,
    horseId: string,
    date: string,
    time: string,
    excludeSessionId?: number
  ): boolean => {
    const selectedPatient = patients.find(p => p.id === parseInt(patientId));
    const selectedProfessional = professionals.find(p => p.id === parseInt(professionalId));
    const selectedHorse = horses.find(h => h.id === parseInt(horseId));

    if (!selectedPatient || !selectedProfessional || !selectedHorse) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos.",
        variant: "destructive"
      });
      return false;
    }

    return validateHorseAvailability(horseId, date, excludeSessionId) &&
      validateProfessionalAvailability(professionalId, date, time, excludeSessionId);
  };

  const createSessionObject = (
    sessionData: NewSessionData | EditingSessionData,
    isNew = true
  ): Session | null => {
    const selectedPatient = patients.find(p => p.id === parseInt(sessionData.patientId));
    const selectedProfessional = professionals.find(p => p.id === parseInt(sessionData.professionalId));
    const selectedHorse = horses.find(h => h.id === parseInt(sessionData.horseId));

    if (!selectedPatient || !selectedProfessional || !selectedHorse) {
      return null;
    }

    const id = isNew 
      ? (sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1)
      : (sessionData as EditingSessionData).id;

    return {
      id,
      date: sessionData.date,
      time: sessionData.time,
      patientId: parseInt(sessionData.patientId),
      patientName: `${selectedPatient.name} ${selectedPatient.lastName}`,
      professionalId: parseInt(sessionData.professionalId),
      professionalName: `${selectedProfessional.name} ${selectedProfessional.lastName}`,
      horseId: parseInt(sessionData.horseId),
      horseName: selectedHorse.name
    };
  };

  const generateTimeSlots = (currentDate: Date) => {
    return Array.from({ length: 10 }, (_, i) => {
      const hour = i + 8;
      const time = `${hour}:00`;
      return {
        time,
        sessions: sessions.filter(s => s.date === formatDate(currentDate) && s.time === time)
      };
    });
  };

  return {
    validateSessionData,
    createSessionObject,
    generateTimeSlots,
    toast
  };
}
