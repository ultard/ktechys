import './ProgressHeader.css';

interface ProgressHeaderProps {
  technologies: Array<{
    id: number;
    title: string;
    description: string;
    status: 'not-started' | 'in-progress' | 'completed';
  }>;
}

function ProgressHeader({ technologies }: ProgressHeaderProps) {
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;

  return (
    <div className="progress-header">
      <h2>Прогресс изучения</h2>
      <p>
        Всего технологий:
        {total}
      </p>
      <p>
        Изучено:
        {completed}
      </p>
      <p>
        Не начато:
        {notStartedCount}
      </p>
      <p>
        В процессе:
        {inProgressCount}
      </p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p>
        {percentage}
        % завершено
      </p>
    </div>
  );
}

export default ProgressHeader;
