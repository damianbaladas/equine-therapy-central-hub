
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export interface WorkHour {
  professionalId: number;
  professionalName: string;
  date: string;
  hoursWorked: number;
  sessionsCount: number;
  isAdministrative?: boolean;
}

interface WorkHoursTableProps {
  workHours: WorkHour[];
  period: string;
}

const WorkHoursTable: React.FC<WorkHoursTableProps> = ({ workHours, period }) => {
  // Group work hours by professional
  const professionalHours = workHours.reduce<{
    [key: string]: {
      professionalName: string;
      totalHours: number;
      totalSessions: number;
      administrativeHours: number;
      days: Set<string>;
      isAdministrative: boolean;
    };
  }>((acc, hour) => {
    const id = hour.professionalId.toString();
    
    if (!acc[id]) {
      acc[id] = {
        professionalName: hour.professionalName,
        totalHours: 0,
        totalSessions: 0,
        administrativeHours: 0,
        days: new Set(),
        isAdministrative: hour.isAdministrative || false
      };
    }
    
    if (hour.isAdministrative) {
      acc[id].administrativeHours += hour.hoursWorked;
    } else {
      acc[id].totalSessions += hour.sessionsCount;
    }
    
    acc[id].totalHours += hour.hoursWorked;
    acc[id].days.add(hour.date);
    acc[id].isAdministrative = acc[id].isAdministrative || hour.isAdministrative || false;
    
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-equine-green-600" />
            Horas trabajadas
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-equine-green-50">
            {period}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Resumen de horas trabajadas por profesionales</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Profesional</TableHead>
              <TableHead>Días trabajados</TableHead>
              <TableHead>Tipo de trabajo</TableHead>
              <TableHead>Total sesiones</TableHead>
              <TableHead>Horas administrativas</TableHead>
              <TableHead>Total horas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(professionalHours).map((professional, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{professional.professionalName}</TableCell>
                <TableCell>{professional.days.size}</TableCell>
                <TableCell>
                  <Badge variant={professional.isAdministrative ? "outline" : "default"} className={professional.isAdministrative ? "bg-blue-50 text-blue-600" : "bg-equine-green-100 text-equine-green-600"}>
                    {professional.isAdministrative ? 'Administrativo' : 'Sesiones'}
                  </Badge>
                </TableCell>
                <TableCell>{professional.totalSessions}</TableCell>
                <TableCell>{professional.administrativeHours}</TableCell>
                <TableCell className="font-semibold">{professional.totalHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorkHoursTable;
