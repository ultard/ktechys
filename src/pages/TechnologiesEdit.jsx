import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import TechnologyForm from '../components/TechnologyForm.jsx';
import useTechnologiesApi from '../hooks/useTechnologiesApi.ts';
import useNotification from '../hooks/useNotification.ts';

function TechnologiesEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const techId = Number(searchParams.get('id'));

  const { showSuccess } = useNotification();
  const { technologies, updateTechnology } = useTechnologiesApi();

  const technology = technologies.find(tech => tech.id === techId);

  if (!technology) {
    return (
      <Box sx={{ mx: 'auto', width: 'fit-content', marginTop: '30px' }}>
        <Typography>Technology not found</Typography>
      </Box>
    );
  }

  function onSave(technology) {
    updateTechnology(techId, technology);
    showSuccess('Изменения сохранены');
  }

  function onCancel() {
    navigate('/technologies');
  }

  return (
    <>
      <TechnologyForm
        initialData={technology}
        onSave={onSave}
        onCancel={onCancel}
      />
    </>
  );
}

export default TechnologiesEdit;
