
import { Session, Patient, Professional, Horse } from '@/types/professionals';
import { useToast } from '@/hooks/use-toast';

export function useSessionValidation(
  sessions: Session[],
  horses: Horse[],
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

  return {
    validateHorseAvailability,
    validateProfessionalAvailability,
  };
}
