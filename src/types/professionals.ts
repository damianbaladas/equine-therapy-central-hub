
export interface Professional {
  id: number;
  name: string;
  lastName: string;
}

export interface WorkHourEntry {
  id: number;
  professionalId: number;
  professionalName: string;
  date: string;
  hours: number;
}

export interface Session {
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

export interface TimeSlot {
  time: string;
  sessions: Session[];
}

export interface Patient {
  id: number;
  name: string;
  lastName: string;
}

export interface Horse {
  id: number;
  name: string;
  availability: boolean;
}
