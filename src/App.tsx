import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';

interface Technology {
  id: number;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

function App() {
  const [technologies, setTechnologies] = useState<Technology[]>([
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение базовых компонентов',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Освоение синтаксиса JSX',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'State Management',
      description: 'Работа с состоянием компонентов',
      status: 'not-started'
    }
    // Добавьте больше технологий по желанию
  ]);

  const [filter, setFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');

  const handleStatusChange = (id: number) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === id
          ? {
              ...tech,
              status:
              tech.status === 'not-started'
                ? 'in-progress'
                : tech.status === 'in-progress'
                  ? 'completed'
                  : 'not-started'
            }
          : tech
      )
    );
  };

  const filteredTechnologies = technologies.filter((tech) => {
    if (filter === 'all') return true;
    return tech.status === filter;
  });

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />
      <QuickActions setTechnologies={setTechnologies} />
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>Все</button>
        <button onClick={() => setFilter('not-started')}>Не начатые</button>
        <button onClick={() => setFilter('in-progress')}>В процессе</button>
        <button onClick={() => setFilter('completed')}>Выполненные</button>
      </div>
      <div className="technologies-list">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            onStatusChange={() => handleStatusChange(tech.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
