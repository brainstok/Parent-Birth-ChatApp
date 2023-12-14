import { Button, Box, FormHelperText } from '@material-ui/core';
import CrmButtonSelect from 'src/components/common/CrmButtonSelect';
import * as Yup from 'yup';
import { Formik } from 'formik';

const validationSchema = Yup.object().shape({
  event: Yup.object().required().typeError('Select an event'),
});

const CreateEvent = ({ patientId, onSubmit }) => {
  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{ event: null }}
        onSubmit={({ event }) => onSubmit(event)}
      >
        {({ errors, handleSubmit, setFieldValue }) => {
          return (
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <Box mb={1}>
                <CrmButtonSelect
                  patientId={patientId}
                  name="eventType"
                  slug="event-type"
                  onChange={(value) => setFieldValue('event', value)}
                />
                {errors.event && <FormHelperText error>{errors.event}</FormHelperText>}
              </Box>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Create Event
              </Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateEvent;
