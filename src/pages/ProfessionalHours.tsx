
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle, Table, CalendarDays, Users } from 'lucide-react';

import DateNavigation from '@/components/schedule/DateNavigation';
import WorkHoursTable from '@/components/professionals/WorkHoursTable';
import WorkHoursCalendar from '@/components/professionals/WorkHoursCalendar';
import AddWorkHoursDialog from '@/components/professionals/AddWorkHoursDialog';
import BatchWorkHoursDialog from '@/components/professionals/BatchWorkHoursDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { mockProfessionals, mockWorkHourEntries } from '@/data/mockProfessionals';
import { useProfessionalHours } from '@/hooks/useProfessionalHours';
import { useWorkHourEntries } from '@/hooks/useWorkHourEntries';

const ProfessionalHours = () => {
  const { 
    workHourEntries,
    isAddDialogOpen,
    isBatchDialogOpen,
    newWorkHour,
    setIsAddDialogOpen,
    setIsBatchDialogOpen,
    setNewWorkHour,
    handleAddWorkHours,
    handleBatchAddWorkHours
  } = useWorkHourEntries(mockWorkHourEntries, mockProfessionals);

  const {
    currentDate,
    viewType,
    displayView,
    workHours,
    getDateRange,
    handleNavigate,
    handleExport,
    handleCalendarDateChange,
    setViewType,
    setDisplayView
  } = useProfessionalHours(workHourEntries);

  const { displayText } = getDateRange();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Control de Horas</h1>
        <div className="flex space-x-2">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsBatchDialogOpen(true)}
              variant="secondary" 
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Registro Masivo
            </Button>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              variant="default" 
              className="bg-equine-green-600 hover:bg-equine-green-700 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Registrar Horas
            </Button>
          </div>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar reporte
          </Button>
        </div>
      </div>

      <DateNavigation
        currentDate={currentDate}
        onNavigate={handleNavigate}
        viewType={viewType}
        onViewChange={setViewType}
      />

      <div className="mb-6">
        <Tabs defaultValue="table" value={displayView} onValueChange={(value) => setDisplayView(value as 'table' | 'calendar')}>
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span>Tabla</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Calendario</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="mt-4">
            <WorkHoursTable 
              workHours={workHours} 
              period={displayText}
            />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <WorkHoursCalendar
              workHours={workHours}
              period={displayText}
              currentDate={currentDate}
              onDateChange={handleCalendarDateChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddWorkHoursDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newWorkHour={newWorkHour}
        onNewWorkHourChange={setNewWorkHour}
        professionals={mockProfessionals}
        onSave={handleAddWorkHours}
      />

      <BatchWorkHoursDialog
        open={isBatchDialogOpen}
        onOpenChange={setIsBatchDialogOpen}
        professionals={mockProfessionals}
        onSave={handleBatchAddWorkHours}
      />
    </div>
  );
};

export default ProfessionalHours;
