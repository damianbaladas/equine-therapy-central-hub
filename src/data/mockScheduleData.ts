
import { Patient, Professional, Horse } from '@/types/professionals';

export const patients: Patient[] = [
  { id: 1, name: 'Juan', lastName: 'Pérez' },
  { id: 2, name: 'María', lastName: 'González' },
  { id: 3, name: 'Diego', lastName: 'Martínez' },
  { id: 4, name: 'Valentina', lastName: 'López' }
];

export const professionals: Professional[] = [
  { id: 1, name: 'Ana', lastName: 'Silva' },
  { id: 2, name: 'Carlos', lastName: 'Rodríguez' },
  { id: 3, name: 'Laura', lastName: 'Torres' },
  { id: 4, name: 'Roberto', lastName: 'Méndez' }
];

export const horses: Horse[] = [
  { id: 1, name: 'Luna', availability: true },
  { id: 2, name: 'Trueno', availability: true },
  { id: 3, name: 'Estrella', availability: true },
  { id: 4, name: 'Relámpago', availability: false },
  { id: 5, name: 'Tornado', availability: true }
];

export const initialSessions = [
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
];
