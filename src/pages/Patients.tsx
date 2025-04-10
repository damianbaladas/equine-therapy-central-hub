import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import PatientCard from '@/components/patients/PatientCard';
import PatientSearch from '@/components/patients/PatientSearch';
import { 
  AddPatientDialog, 
  ViewPatientDialog, 
  EditPatientDialog 
} from '@/components/patients/PatientDialogs';

interface Patient {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  age: number;
  phone: string;
  email: string;
  parents: string;
  medicalHistory: string;
  progress: string;
  observations: string;
}

const Patients = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      ci: '1234567-8',
      name: 'Juan',
      lastName: 'Pérez',
      age: 12,
      phone: '099123456',
      email: 'juanperez@example.com',
      parents: 'Carlos Pérez y María Rodríguez',
      medicalHistory: 'Parálisis cerebral leve. Fisioterapia desde los 3 años.',
      progress: 'Mejora en equilibrio y postura después de 6 meses de equinoterapia.',
      observations: 'Responde muy bien al caballo Luna. Disfruta mucho de las sesiones.'
    },
    {
      id: 2,
      ci: '8765432-1',
      name: 'María',
      lastName: 'González',
      age: 8,
      phone: '098765432',
      email: 'mariagonzalez@example.com',
      parents: 'José González y Ana Martínez',
      medicalHistory: 'Síndrome de Down. Fisioterapia y terapia ocupacional.',
      progress: 'Mejora en coordinación y comunicación verbal.',
      observations: 'Tiene buena conexión con el caballo Trueno.'
    },
    {
      id: 3,
      ci: '4567890-1',
      name: 'Diego',
      lastName: 'Martínez',
      age: 15,
      phone: '097654321',
      email: 'diegomartinez@example.com',
      parents: 'Roberto Martínez y Laura Sánchez',
      medicalHistory: 'Trastorno del espectro autista. Terapia ABA desde los 4 años.',
      progress: 'Mejora en interacción social y menor ansiedad.',
      observations: 'Prefiere sesiones tranquilas. Trabaja bien con Estrella.'
    }
  ]);

  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    ci: '',
    name: '',
    lastName: '',
    age: 0,
    phone: '',
    email: '',
    parents: '',
    medicalHistory: '',
    progress: '',
    observations: ''
  });

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleAddPatient = () => {
    const id = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    setPatients([...patients, { id, ...newPatient }]);
    setIsAddDialogOpen(false);
    setNewPatient({
      ci: '',
      name: '',
      lastName: '',
      age: 0,
      phone: '',
      email: '',
      parents: '',
      medicalHistory: '',
      progress: '',
      observations: ''
    });
    toast({
      title: "Paciente agregado",
      description: "El paciente ha sido agregado exitosamente",
    });
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient({ ...patient });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? editingPatient : p));
      setIsEditDialogOpen(false);
      setEditingPatient(null);
      toast({
        title: "Paciente actualizado",
        description: "Los datos del paciente han sido actualizados exitosamente",
      });
    }
  };

  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter(patient => patient.id !== id));
    toast({
      title: "Paciente eliminado",
      description: "El paciente ha sido eliminado exitosamente",
      variant: "destructive",
    });
  };

  const filteredPatients = patients.filter(
    patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ci.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Pacientes</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-equine-green-600 hover:bg-equine-green-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Paciente
        </Button>
      </div>

      <PatientSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onView={handleViewPatient}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        ))}
      </div>

      <AddPatientDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newPatient={newPatient}
        onNewPatientChange={setNewPatient}
        onSave={handleAddPatient}
      />

      <ViewPatientDialog 
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        patient={selectedPatient}
        onEdit={handleEditPatient}
      />

      <EditPatientDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        patient={editingPatient}
        onPatientChange={setEditingPatient}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Patients;
