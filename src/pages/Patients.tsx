
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Mock data for patients
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
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter(patient => patient.id !== id));
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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar pacientes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="equine-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{patient.name} {patient.lastName}</h3>
                  <p className="text-sm text-muted-foreground">CI: {patient.ci}</p>
                  <p className="text-sm text-muted-foreground">Edad: {patient.age} años</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewPatient(patient)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm"><strong>Teléfono:</strong> {patient.phone}</p>
                <p className="text-sm"><strong>Email:</strong> {patient.email}</p>
                <p className="text-sm truncate"><strong>Padres:</strong> {patient.parents}</p>
                <p className="text-sm mt-2 line-clamp-2"><strong>Observaciones:</strong> {patient.observations}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient)}>
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
            <DialogDescription>Complete la información del paciente.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="ci">Cédula de Identidad</Label>
              <Input 
                id="ci" 
                value={newPatient.ci}
                onChange={(e) => setNewPatient({...newPatient, ci: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input 
                id="lastName" 
                value={newPatient.lastName}
                onChange={(e) => setNewPatient({...newPatient, lastName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="age">Edad</Label>
              <Input 
                id="age" 
                type="number"
                value={newPatient.age.toString()}
                onChange={(e) => setNewPatient({...newPatient, age: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="parents">Padres</Label>
              <Input 
                id="parents" 
                value={newPatient.parents}
                onChange={(e) => setNewPatient({...newPatient, parents: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="medicalHistory">Historial Médico</Label>
              <Textarea 
                id="medicalHistory" 
                rows={3}
                value={newPatient.medicalHistory}
                onChange={(e) => setNewPatient({...newPatient, medicalHistory: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="progress">Progreso de la Terapia</Label>
              <Textarea 
                id="progress" 
                rows={3}
                value={newPatient.progress}
                onChange={(e) => setNewPatient({...newPatient, progress: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea 
                id="observations" 
                rows={3}
                value={newPatient.observations}
                onChange={(e) => setNewPatient({...newPatient, observations: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPatient} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cédula de Identidad</h3>
                  <p>{selectedPatient.ci}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre Completo</h3>
                  <p>{selectedPatient.name} {selectedPatient.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Edad</h3>
                  <p>{selectedPatient.age} años</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                  <p>{selectedPatient.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{selectedPatient.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Padres</h3>
                  <p>{selectedPatient.parents}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Historial Médico</h3>
                <p className="mt-1 whitespace-pre-wrap">{selectedPatient.medicalHistory}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Progreso de la Terapia</h3>
                <p className="mt-1 whitespace-pre-wrap">{selectedPatient.progress}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Observaciones</h3>
                <p className="mt-1 whitespace-pre-wrap">{selectedPatient.observations}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium">Próximas Sesiones</h3>
                <div className="mt-2">
                  <div className="bg-equine-green-50 p-4 rounded-md">
                    <p className="text-sm">Viernes, 12 de Mayo - 10:00 AM</p>
                    <p className="text-sm">Profesional: Ana Silva</p>
                    <p className="text-sm">Caballo: Luna</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
            <Button variant="outline">Editar</Button>
            <Button className="bg-equine-green-600 hover:bg-equine-green-700">Agendar Sesión</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
