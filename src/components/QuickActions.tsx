import './QuickActions.css';
import type { Dispatch, SetStateAction } from 'react';

interface QuickActionsProps {
  setTechnologies: Dispatch<
    SetStateAction<
      Array<{
        id: number;
        title: string;
        description: string;
        status: 'not-started' | 'in-progress' | 'completed';
      }>
    >
  >;
}

function QuickActions({ setTechnologies }: QuickActionsProps) {
  const markAllCompleted = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'completed' })));
  };

  const resetAll = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'not-started' })));
  };

  const randomNext = () => {
    setTechnologies((prev) => {
      const notStarted = prev.filter(tech => tech.status === 'not-started');
      if (notStarted.length === 0) return prev;
      const randomIndex = Math.floor(Math.random() * notStarted.length);
      const selectedId = notStarted[randomIndex].id;
      return prev.map(tech =>
        tech.id === selectedId ? { ...tech, status: 'in-progress' } : tech
      );
    });
  };

  return (
    <div className="quick-actions">
      <button onClick={markAllCompleted}>Отметить все как выполненные</button>
      <button onClick={resetAll}>Сбросить все статусы</button>
      <button onClick={randomNext}>Случайный выбор следующей технологии</button>
    </div>
  );
}

export default QuickActions;
