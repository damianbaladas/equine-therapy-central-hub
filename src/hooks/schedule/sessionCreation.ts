
import { Session, Patient, Professional, Horse } from '@/types/professionals';
import { NewSessionData, EditingSessionData } from './types';
import { useSessionValidation } from './sessionValidation';
import { useToast } from '@/hooks/use-toast';

export function useSessionCreation(
  sessions: Session[],
  patients: Patient[],
  professionals: Professional[],
  horses: Horse[]
) {
  const { toast } = useToast();
  const { validateHorseAvailability, validateProfessionalAvailability } = useSessionValidation(sessions, horses);

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

  return {
    validateSessionData,
    createSessionObject,
  };
}
