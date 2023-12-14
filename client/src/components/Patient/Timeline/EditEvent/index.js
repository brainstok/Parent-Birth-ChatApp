import { useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import EventForm from '../EventForm';

const EditEvent = ({ patientId, setEvents, event }) => {
  const handleSave = async (values) => {
    const payload = {
      eventTypeId: values.eventType.id,
      createdAt: values.createdAt,
    };
    try {
      const { data: events } = await axios.put(
        `/api/patients/${patientId}/events/${event.id}`,
        payload
      );
      return events;
    } catch (error) {
      toast.error(`Error editing event`);
      console.log(error);
    }
  };

  return (
    <Box paddingTop={1} paddingBottom={1}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <EventForm
            buttonText="Save Event"
            patientId={patientId}
            initialValues={event}
            onSubmit={async (values) => {
              const newEvents = await handleSave(values);
              setEvents(newEvents);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditEvent;
