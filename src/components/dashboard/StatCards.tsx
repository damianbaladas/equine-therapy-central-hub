
import React from 'react';
import { UsersRound, Calendar, UserRound, PawPrint, Clock } from 'lucide-react';
import { initialSessions } from '@/data/mockScheduleData';
import { formatDate } from '@/hooks/schedule/types';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div className={`${color} rounded-lg shadow-md p-6 flex items-center justify-between`}>
      <div>
        <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="text-equine-green-600">{icon}</div>
    </div>
  );
};

const StatCards = () => {
  // Filter today's sessions
  const today = formatDate(new Date());
  const todaySessions = initialSessions.filter(session => session.date === today);
  
  // Get the next session time if any sessions today
  const nextSession = todaySessions.sort((a, b) => 
    a.time.localeCompare(b.time)
  )[0];
  
  const stats = [
    {
      title: "Pacientes Activos",
      value: 42,
      icon: <UsersRound size={24} />,
      color: "bg-equine-green-100",
    },
    {
      title: "Sesiones Hoy",
      value: todaySessions.length,
      icon: <Calendar size={24} />,
      color: "bg-equine-brown-100",
    },
    {
      title: "Profesionales",
      value: 7,
      icon: <UserRound size={24} />,
      color: "bg-equine-green-100",
    },
    {
      title: "Caballos Disponibles",
      value: 5,
      icon: <PawPrint size={24} />,
      color: "bg-equine-brown-100",
    },
    {
      title: "Próxima Sesión",
      value: nextSession ? nextSession.time : "No hay sesiones",
      icon: <Clock size={24} />,
      color: "bg-equine-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatCards;
