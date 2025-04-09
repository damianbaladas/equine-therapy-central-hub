
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: number;
  ci: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

const Professionals = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  // Available roles (with ability to add more)
  const [roles, setRoles] = useState<string[]>([
    'Administrativo', 
    'Servicio', 
    'Técnico', 
    'Médico', 
    'Psicólogo'
  ]);

  const [newRole, setNewRole] = useState('');
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);

  // Mock data for professionals
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: 1,
      ci: '1111111-1',
      name: 'Ana',
      lastName: 'Silva',
      email: 'anasilva@example.com',
      phone: '099111222',
      role: 'Técnico'
    },
    {
      id: 2,
      ci: '2222222-2',
      name: 'Carlos',
      lastName: 'Rodríguez',
      email: 'carlosrodriguez@example.com',
      phone: '098222333',
      role: 'Médico'
    },
    {
      id: 3,
      ci: '3333333-3',
      name: 'Laura',
      lastName: 'Torres',
      email: 'lauratorres@example.com',
      phone: '097333444',
      role: 'Psicólogo'
    },
    {
      id: 4,
      ci: '4444444-4',
      name: 'Roberto',
      lastName: 'Méndez',
      email: 'robertomendez@example.com',
      phone: '096444555',
      role: 'Administrativo'
    },
    {
      id: 5,
      ci: '5555555-5',
      name: 'Lucía',
      lastName: 'Fernández',
      email: 'luciafernandez@example.com',
      phone: '095555666',
      role: 'Servicio'
    }
  ]);

  const [newProfessional, setNewProfessional] = useState<Omit<Professional, 'id'>>({
    ci: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Técnico'
  });

  const [editProfessional, setEditProfessional] = useState<Professional>({
    id: 0,
    ci: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Técnico'
  });

  const handleAddProfessional = () => {
    const id = professionals.length > 0 ? Math.max(...professionals.map(p => p.id)) + 1 : 1;
    setProfessionals([...professionals, { id, ...newProfessional }]);
    setIsAddDialogOpen(false);
    setNewProfessional({
      ci: '',
      name: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Técnico'
    });
    
    toast({
      title: "Profesional agregado",
      description: `${newProfessional.name} ${newProfessional.lastName} ha sido agregado correctamente.`
    });
  };

  const handleViewProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsViewDialogOpen(true);
  };

  const handleEditProfessional = (professional: Professional) => {
    setEditProfessional({ ...professional });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = () => {
    setProfessionals(
      professionals.map(p => (p.id === editProfessional.id ? editProfessional : p))
    );
    setIsEditDialogOpen(false);
    
    toast({
      title: "Profesional actualizado",
      description: `${editProfessional.name} ${editProfessional.lastName} ha sido actualizado correctamente.`
    });
  };

  const handleDeleteProfessional = (id: number) => {
    const professionalToDelete = professionals.find(p => p.id === id);
    setProfessionals(professionals.filter(professional => professional.id !== id));
    
    toast({
      title: "Profesional eliminado",
      description: professionalToDelete ? `${professionalToDelete.name} ${professionalToDelete.lastName} ha sido eliminado.` : "El profesional ha sido eliminado.",
      variant: "destructive"
    });
  };

  const handleAddRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole('');
      setIsAddRoleDialogOpen(false);
      
      toast({
        title: "Rol agregado",
        description: `El rol "${newRole}" ha sido agregado correctamente.`
      });
    }
  };

  const filteredProfessionals = professionals.filter(
    professional => 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.ci.includes(searchTerm)
  );

  // Role color mapping for badges
  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      'Técnico': 'bg-blue-100 text-blue-800',
      'Médico': 'bg-green-100 text-green-800',
      'Psicólogo': 'bg-purple-100 text-purple-800',
      'Administrativo': 'bg-yellow-100 text-yellow-800',
      'Servicio': 'bg-gray-100 text-gray-800'
    };
    
    return roleColors[role] || 'bg-equine-green-100 text-equine-green-800';
  };

  // Attempt to fetch professionals from Supabase
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from('personal')
          .select('*');
        
        if (error) {
          console.error('Error fetching professionals:', error);
        } else if (data.length > 0) {
          // Map Supabase data to our Professional interface
          const mappedData: Professional[] = data.map((item, index) => ({
            id: index + 1,
            ci: item.cedula || '',
            name: item.nombre || '',
            lastName: item.apellido || '',
            email: item.email || '',
            phone: item.telefono || '',
            role: item.cargo || 'Técnico'
          }));
          setProfessionals(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch professionals:', error);
      }
    };

    fetchProfessionals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Profesionales</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddRoleDialogOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Rol
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-equine-green-600 hover:bg-equine-green-700">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Profesional
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar profesionales..."
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
        {filteredProfessionals.map(professional => (
          <Card key={professional.id} className="equine-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{professional.name} {professional.lastName}</h3>
                  <p className="text-sm text-muted-foreground">CI: {professional.ci}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getRoleColor(professional.role)}`}>
                    {professional.role}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewProfessional(professional)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditProfessional(professional)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProfessional(professional.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm"><strong>Email:</strong> {professional.email}</p>
                <p className="text-sm"><strong>Teléfono:</strong> {professional.phone}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => handleViewProfessional(professional)}>
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Professional Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Profesional</DialogTitle>
            <DialogDescription>Complete la información del profesional.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="ci">Cédula de Identidad</Label>
              <Input 
                id="ci" 
                value={newProfessional.ci}
                onChange={(e) => setNewProfessional({...newProfessional, ci: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                value={newProfessional.name}
                onChange={(e) => setNewProfessional({...newProfessional, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input 
                id="lastName" 
                value={newProfessional.lastName}
                onChange={(e) => setNewProfessional({...newProfessional, lastName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newProfessional.email}
                onChange={(e) => setNewProfessional({...newProfessional, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                value={newProfessional.phone}
                onChange={(e) => setNewProfessional({...newProfessional, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select 
                value={newProfessional.role} 
                onValueChange={(value) => setNewProfessional({...newProfessional, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddProfessional} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Professional Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Profesional</DialogTitle>
          </DialogHeader>
          {selectedProfessional && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cédula de Identidad</h3>
                  <p>{selectedProfessional.ci}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre Completo</h3>
                  <p>{selectedProfessional.name} {selectedProfessional.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{selectedProfessional.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                  <p>{selectedProfessional.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rol</h3>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getRoleColor(selectedProfessional.role)}`}>
                    {selectedProfessional.role}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium">Sesiones Programadas</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-equine-green-50 p-4 rounded-md">
                    <p className="text-sm">Viernes, 12 de Mayo - 10:00 AM</p>
                    <p className="text-sm">Paciente: Juan Pérez</p>
                    <p className="text-sm">Caballo: Luna</p>
                  </div>
                  <div className="bg-equine-green-50 p-4 rounded-md">
                    <p className="text-sm">Viernes, 12 de Mayo - 11:00 AM</p>
                    <p className="text-sm">Paciente: María González</p>
                    <p className="text-sm">Caballo: Trueno</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
            <Button variant="outline" onClick={() => {
              if (selectedProfessional) {
                handleEditProfessional(selectedProfessional);
                setIsViewDialogOpen(false);
              }
            }}>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Professional Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Profesional</DialogTitle>
            <DialogDescription>Modifique la información del profesional.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="edit-ci">Cédula de Identidad</Label>
              <Input 
                id="edit-ci" 
                value={editProfessional.ci}
                onChange={(e) => setEditProfessional({...editProfessional, ci: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input 
                id="edit-name" 
                value={editProfessional.name}
                onChange={(e) => setEditProfessional({...editProfessional, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-lastName">Apellido</Label>
              <Input 
                id="edit-lastName" 
                value={editProfessional.lastName}
                onChange={(e) => setEditProfessional({...editProfessional, lastName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email"
                value={editProfessional.email}
                onChange={(e) => setEditProfessional({...editProfessional, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input 
                id="edit-phone" 
                value={editProfessional.phone}
                onChange={(e) => setEditProfessional({...editProfessional, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rol</Label>
              <Select 
                value={editProfessional.role} 
                onValueChange={(value) => setEditProfessional({...editProfessional, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProfessional} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Rol</DialogTitle>
            <DialogDescription>Ingrese el nombre del nuevo rol.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="roleName">Nombre del Rol</Label>
            <Input 
              id="roleName" 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddRole} className="bg-equine-green-600 hover:bg-equine-green-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Professionals;
