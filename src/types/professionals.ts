
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
