
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProfessionalSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProfessionalSearch: React.FC<ProfessionalSearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar profesionales..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
  );
};

export default ProfessionalSearch;
