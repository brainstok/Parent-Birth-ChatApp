import { Box, Button, Grid } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CrmButtonSelect from 'src/components/common/CrmButtonSelect';

const validationSchema = Yup.object().shape({
  createdAt: Yup.date().required('Required').typeError('Required'),
  eventType: Yup.object().required('Required').typeError('Required'),
});

const EventForm = ({ onSubmit, initialValues, buttonText, patientId }) => {
  return (
    <Box paddingTop={1} paddingBottom={1}>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={initialValues}
        onSubmit={(update, { resetForm }) => onSubmit(update, resetForm)}
      >
        {({ values, errors, handleSubmit, setFieldValue }) => {
          return (
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <CrmButtonSelect
                    value={values.eventType}
                    hasError={Boolean(errors.eventType)}
                    patientId={patientId}
                    name="eventType"
                    slug="event-type"
                    onChange={(value) => setFieldValue('eventType', value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      error={Boolean(errors.createdAt)}
                      disableToolbar
                      variant="outlined"
                      format="MM/dd/yyyy"
                      margin="normal"
                      inputVariant="outlined"
                      id="format-date"
                      label="Follow Up Date"
                      value={values.createdAt}
                      fullWidth
                      InputProps={{ shrink: 'true' }}
                      onChange={(createdAt) => {
                        setFieldValue('createdAt', createdAt);
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" color="primary">
                    {buttonText}
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default EventForm;
