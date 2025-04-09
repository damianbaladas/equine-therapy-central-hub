
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Horse {
  id: number;
  name: string;
  age: number;
  health: string;
  availability: boolean;
  breed: string;
  temperament: string;
}

const Horses = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);

  // Temperament options
  const temperaments = [
    'Tranquilo',
    'Energético',
    'Sensible',
    'Sociable',
    'Independiente',
    'Dócil',
    'Curioso'
  ];

  // Mock data for horses
  const [horses, setHorses] = useState<Horse[]>([
    {
      id: 1,
      name: 'Luna',
      age: 8,
      health: 'Excelente. Último control veterinario: 01/04/2025',
      availability: true,
      breed: 'Criollo',
      temperament: 'Tranquilo'
    },
    {
      id: 2,
      name: 'Trueno',
      age: 10,
      health: 'Bueno. Requiere control de herraduras.',
      availability: true,
      breed: 'Cuarto de Milla',
      temperament: 'Energético'
    },
    {
      id: 3,
      name: 'Estrella',
      age: 6,
      health: 'Excelente. Dieta especial por sensibilidad digestiva.',
      availability: true,
      breed: 'Appaloosa',
      temperament: 'Sensible'
    },
    {
      id: 4,
      name: 'Relámpago',
      age: 12,
      health: 'Regular. En tratamiento por dolor articular.',
      availability: false,
      breed: 'Árabe',
      temperament: 'Dócil'
    },
    {
      id: 5,
      name: 'Tornado',
      age: 7,
      health: 'Bueno. Recuperándose de lesión menor en pata delantera.',
      availability: true,
      breed: 'Pura Sangre',
      temperament: 'Sociable'
    }
  ]);

  const [newHorse, setNewHorse] = useState<Omit<Horse, 'id'>>({
    name: '',
    age: 0,
    health: '',
    availability: true,
    breed: '',
    temperament: 'Tranquilo'
  });

  const handleAddHorse = () => {
    const id = horses.length > 0 ? Math.max(...horses.map(h => h.id)) + 1 : 1;
    setHorses([...horses, { id, ...newHorse }]);
    setIsAddDialogOpen(false);
    setNewHorse({
      name: '',
      age: 0,
      health: '',
      availability: true,
      breed: '',
      temperament: 'Tranquilo'
    });
  };

  const handleViewHorse = (horse: Horse) => {
    setSelectedHorse(horse);
    setIsViewDialogOpen(true);
  };

  const handleDeleteHorse = (id: number) => {
    setHorses(horses.filter(horse => horse.id !== id));
  };

  const handleToggleAvailability = (id: number) => {
    setHorses(horses.map(horse => 
      horse.id === id ? { ...horse, availability: !horse.availability } : horse
    ));
  };

  const filteredHorses = horses.filter(
    horse => 
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.temperament.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Caballos</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-equine-green-600 hover:bg-equine-green-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Caballo
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar caballos..."
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
        {filteredHorses.map(horse => (
          <Card key={horse.id} className="equine-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{horse.name}</h3>
                  <p className="text-sm text-muted-foreground">{horse.breed}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                    horse.availability 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {horse.availability ? 'Disponible' : 'No Disponible'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewHorse(horse)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteHorse(horse.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm"><strong>Edad:</strong> {horse.age} años</p>
                <p className="text-sm"><strong>Temperamento:</strong> {horse.temperament}</p>
                <p className="text-sm line-clamp-2"><strong>Salud:</strong> {horse.health}</p>
              </div>
              <div className="mt-4 flex justify-between">
                <Button 
                  variant={horse.availability ? "outline" : "default"} 
                  size="sm" 
                  onClick={() => handleToggleAvailability(horse.id)}
                  className={horse.availability ? "" : "bg-equine-green-600 hover:bg-equine-green-700"}
                >
                  {horse.availability ? 'Marcar No Disponible' : 'Marcar Disponible'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleViewHorse(horse)}>
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Horse Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Caballo</DialogTitle>
            <DialogDescription>Complete la información del caballo.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                value={newHorse.name}
                onChange={(e) => setNewHorse({...newHorse, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="age">Edad</Label>
              <Input 
                id="age" 
                type="number"
                value={newHorse.age.toString()}
                onChange={(e) => setNewHorse({...newHorse, age: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="breed">Raza</Label>
              <Input 
                id="breed" 
                value={newHorse.breed}
                onChange={(e) => setNewHorse({...newHorse, breed: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="temperament">Temperamento</Label>
              <Select 
                value={newHorse.temperament} 
                onValueChange={(value) => setNewHorse({...newHorse, temperament: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar temperamento" />
                </SelectTrigger>
                <SelectContent>
                  {temperaments.map((temp) => (
                    <SelectItem key={temp} value={temp}>
                      {temp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="health">Estado de Salud</Label>
              <Textarea 
                id="health" 
                rows={3}
                value={newHorse.health}
                onChange={(e) => setNewHorse({...newHorse, health: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="availability" 
                  checked={newHorse.availability}
                  onChange={(e) => setNewHorse({...newHorse, availability: e.target.checked})}
                  className="rounded border-gray-300 text-equine-green-600 focus:ring-equine-green-500"
                />
                <Label htmlFor="availability">Disponible para terapia</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddHorse} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Horse Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Caballo</DialogTitle>
          </DialogHeader>
          {selectedHorse && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p>{selectedHorse.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Edad</h3>
                  <p>{selectedHorse.age} años</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Raza</h3>
                  <p>{selectedHorse.breed}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Temperamento</h3>
                  <p>{selectedHorse.temperament}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Disponibilidad</h3>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                    selectedHorse.availability 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedHorse.availability ? 'Disponible' : 'No Disponible'}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Estado de Salud</h3>
                <p className="mt-1 whitespace-pre-wrap">{selectedHorse.health}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium">Sesiones Programadas</h3>
                <div className="mt-2 space-y-2">
                  {selectedHorse.availability ? (
                    <>
                      <div className="bg-equine-green-50 p-4 rounded-md">
                        <p className="text-sm">Viernes, 12 de Mayo - 10:00 AM</p>
                        <p className="text-sm">Paciente: Juan Pérez</p>
                        <p className="text-sm">Profesional: Ana Silva</p>
                      </div>
                      <div className="bg-equine-green-50 p-4 rounded-md">
                        <p className="text-sm">Viernes, 12 de Mayo - 11:00 AM</p>
                        <p className="text-sm">Paciente: María González</p>
                        <p className="text-sm">Profesional: Carlos Rodríguez</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No hay sesiones programadas mientras el caballo no esté disponible.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
            <Button variant="outline">Editar</Button>
            {selectedHorse && (
              <Button 
                onClick={() => {
                  if (selectedHorse) {
                    handleToggleAvailability(selectedHorse.id);
                    setIsViewDialogOpen(false);
                  }
                }}
                className={selectedHorse.availability ? "bg-red-600 hover:bg-red-700" : "bg-equine-green-600 hover:bg-equine-green-700"}
              >
                {selectedHorse.availability ? 'Marcar No Disponible' : 'Marcar Disponible'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Horses;
