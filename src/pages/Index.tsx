
import React from 'react';
import { Calendar, ChevronRight, UsersRound, UserRound, PawPrint } from 'lucide-react';
import StatCards from '@/components/dashboard/StatCards';
import { Link } from 'react-router-dom';
import { initialSessions } from '@/data/mockScheduleData';
import { formatDate } from '@/hooks/schedule/types';

const Index = () => {
  // Filter sessions to only show today's sessions
  const today = formatDate(new Date());
  const upcomingSessions = initialSessions.filter(session => session.date === today);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-equine-green-700">Dashboard</h1>
        <div className="text-equine-green-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{new Date().toLocaleDateString('es-UY')}</span>
          </div>
        </div>
      </div>
      
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="equine-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-equine-green-700">Sesiones de Hoy</h2>
            <Link to="/schedule" className="text-equine-green-600 flex items-center hover:text-equine-green-700">
              <span>Ver Agenda</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-equine-green-200">
              <thead className="bg-equine-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-equine-green-700 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-equine-green-700 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-equine-green-700 uppercase tracking-wider">Profesional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-equine-green-700 uppercase tracking-wider">Caballo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-equine-green-200">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-equine-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.professionalName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.horseName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay sesiones programadas para hoy
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="equine-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-equine-green-700">Actividad Reciente</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-equine-green-50">
              <div className="rounded-full bg-equine-green-200 p-2">
                <UsersRound className="h-5 w-5 text-equine-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Nuevo paciente registrado</p>
                <p className="text-xs text-gray-500">Santiago Gómez - hace 1 hora</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-equine-green-50">
              <div className="rounded-full bg-equine-brown-200 p-2">
                <Calendar className="h-5 w-5 text-equine-brown-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Sesión reprogramada</p>
                <p className="text-xs text-gray-500">María González - hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-equine-green-50">
              <div className="rounded-full bg-equine-green-200 p-2">
                <PawPrint className="h-5 w-5 text-equine-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Actualización de caballo</p>
                <p className="text-xs text-gray-500">Luna - control veterinario completo - hace 3 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-equine-green-50">
              <div className="rounded-full bg-equine-brown-200 p-2">
                <UserRound className="h-5 w-5 text-equine-brown-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Nuevo profesional</p>
                <p className="text-xs text-gray-500">Jorge Fernández - Psicólogo - hace 1 día</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
