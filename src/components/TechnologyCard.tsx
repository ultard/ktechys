import './TechnologyCard.css';

interface TechnologyCardProps {
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  onStatusChange: () => void;
}

function TechnologyCard({ title, description, status, onStatusChange }: TechnologyCardProps) {
  return (
    <div className={`technology-card status-${status}`} onClick={onStatusChange}>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>
        Статус:
        {status === 'not-started' ? 'Не начато' : status === 'in-progress' ? 'В процессе' : 'Завершено'}
      </span>
    </div>
  );
}

export default TechnologyCard;
