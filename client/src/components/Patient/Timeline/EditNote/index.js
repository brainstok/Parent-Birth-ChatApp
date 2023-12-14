import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import NoteForm from '../NoteForm';

const NoteUpdate = ({ body, patientId, noteId, setNotes, taggedProviders }) => {
  const handleSave = async (values) => {
    const { body, taggedProviders } = values;

    const taggedProviderIds = taggedProviders.map((provider) => provider.id);

    const updatedNote = { body, taggedProviderIds };

    try {
      const payload = {
        ...updatedNote,
      };

      const { data: notes } = await axios.put(
        `/api/patients/${patientId}/notes/${noteId}`,
        payload
      );

      return notes;
    } catch (error) {
      toast.error(`Error editing note`);
      console.log(error);
    }
  };

  return (
    <Box paddingTop={1} paddingBottom={1}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <NoteForm
            onSubmit={async (value) => {
              const newUpdates = await handleSave(value);
              setNotes(newUpdates);
            }}
            initialValues={{ body, taggedProviders }}
            buttonText="Save"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NoteUpdate;
