import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import ProfessionalSearch from '@/components/professionals/ProfessionalSearch';
import AddProfessionalDialog from '@/components/professionals/AddProfessionalDialog';
import EditProfessionalDialog from '@/components/professionals/EditProfessionalDialog';
import ViewProfessionalDialog from '@/components/professionals/ViewProfessionalDialog';
import AddRoleDialog from '@/components/professionals/AddRoleDialog';

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

  const [roles, setRoles] = useState<string[]>([
    'Administrativo', 
    'Servicio', 
    'Técnico', 
    'Médico', 
    'Psicólogo'
  ]);

  const [newRole, setNewRole] = useState('');
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);

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

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from('personal')
          .select('*');
        
        if (error) {
          console.error('Error fetching professionals:', error);
        } else if (data.length > 0) {
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

      <ProfessionalSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map(professional => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            onView={handleViewProfessional}
            onEdit={handleEditProfessional}
            onDelete={handleDeleteProfessional}
            getRoleColor={getRoleColor}
          />
        ))}
      </div>

      <AddProfessionalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newProfessional={newProfessional}
        onNewProfessionalChange={setNewProfessional}
        roles={roles}
        onSave={handleAddProfessional}
      />

      <ViewProfessionalDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        professional={selectedProfessional}
        onEdit={handleEditProfessional}
        getRoleColor={getRoleColor}
      />

      <EditProfessionalDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editProfessional={editProfessional}
        onEditProfessionalChange={setEditProfessional}
        roles={roles}
        onSave={handleUpdateProfessional}
      />

      <AddRoleDialog
        open={isAddRoleDialogOpen}
        onOpenChange={setIsAddRoleDialogOpen}
        newRole={newRole}
        onNewRoleChange={setNewRole}
        onSave={handleAddRole}
      />
    </div>
  );
};

export default Professionals;
