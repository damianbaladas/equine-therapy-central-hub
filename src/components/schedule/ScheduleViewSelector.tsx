
import React from 'react';
import { List, CalendarRange } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduleViewSelectorProps {
  displayView: 'list' | 'calendar';
  onViewChange: (value: 'list' | 'calendar') => void;
  listContent: React.ReactNode;
  calendarContent: React.ReactNode;
}

const ScheduleViewSelector: React.FC<ScheduleViewSelectorProps> = ({
  displayView,
  onViewChange,
  listContent,
  calendarContent
}) => {
  return (
    <Tabs defaultValue="list" value={displayView} onValueChange={(value) => onViewChange(value as 'list' | 'calendar')}>
      <TabsList className="grid w-full max-w-xs grid-cols-2">
        <TabsTrigger value="list" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span>Lista</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          <span>Calendario</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="mt-4">
        {listContent}
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-4">
        {calendarContent}
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleViewSelector;
