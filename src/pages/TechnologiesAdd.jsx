import { useNavigate } from 'react-router-dom';

import TechnologyForm from '../components/TechnologyForm.jsx';
import useTechnologiesApi from '../hooks/useTechnologiesApi.ts';
import useNotification from '../hooks/useNotification.ts';

function TechnologiesAdd() {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const { addTechnology } = useTechnologiesApi();

  function onSave(technology) {
    addTechnology(technology);
    showSuccess('Технология добавлена');
    navigate('/');
  }

  function onCancel() {
    navigate('/');
  }

  return (
    <>
      <TechnologyForm
        onSave={onSave}
        onCancel={onCancel}
      />
    </>
  );
}

export default TechnologiesAdd;
