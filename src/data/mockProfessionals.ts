
import { Professional, WorkHourEntry } from '@/types/professionals';

export const mockProfessionals: Professional[] = [
  { id: 1, name: 'Ana', lastName: 'Silva' },
  { id: 2, name: 'Carlos', lastName: 'Rodríguez' },
  { id: 3, name: 'Laura', lastName: 'Torres' },
  { id: 4, name: 'Roberto', lastName: 'Méndez' },
  { id: 5, name: 'María', lastName: 'González', },
  { id: 6, name: 'Juan', lastName: 'López' },
];

export const mockWorkHourEntries: WorkHourEntry[] = [
  {
    id: 1,
    professionalId: 5,
    professionalName: 'María González',
    date: '2025-04-09',
    hours: 8
  },
  {
    id: 2,
    professionalId: 6,
    professionalName: 'Juan López',
    date: '2025-04-10',
    hours: 4
  },
  {
    id: 3,
    professionalId: 1,
    professionalName: 'Ana Silva',
    date: '2025-04-09',
    hours: 6
  },
  {
    id: 4,
    professionalId: 2,
    professionalName: 'Carlos Rodríguez',
    date: '2025-04-10',
    hours: 7
  },
];
