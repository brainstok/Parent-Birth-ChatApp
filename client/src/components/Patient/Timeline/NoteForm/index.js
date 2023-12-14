import { Box, makeStyles, Button, Grid } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AutoResizeInput from 'src/components/common/AutoResizeInput';
import ProviderMultiSelect from 'src/components/common/ProviderMultiSelect';

const useStyles = makeStyles((theme) => ({
  timeClass: {
    color: theme.palette.primary.main,
    fontSize: 12,
  },
  autoResizeClass: { fontSize: 14, padding: theme.spacing(1) },
  editIconClass: { color: theme.palette.primary.main, cursor: 'pointer' },
}));

const validationSchema = Yup.object().shape({
  body: Yup.string().required('Write an update...').min(5, 'Should be at least 5 characters long'),
});

const newValues = {
  body: '',
  taggedProviders: [],
};

const NoteForm = ({ onSubmit, buttonText, initialValues }) => {
  const { autoResizeClass } = useStyles();

  return (
    <Box paddingTop={1} paddingBottom={1}>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={initialValues ? initialValues : newValues}
        onSubmit={(update, { resetForm }) => onSubmit(update, resetForm)}
      >
        {({ values, errors, handleChange, handleSubmit, setFieldValue, setErrors }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12}>
                  <AutoResizeInput
                    name="body"
                    errortext={errors.body}
                    value={values.body}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors({});
                    }}
                    variant="outlined"
                    placeholder="Write an Note..."
                    className={autoResizeClass}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProviderMultiSelect
                    providers={values.taggedProviders}
                    label="Tagged Providers"
                    handleChange={(newValues) => {
                      setFieldValue('taggedProviders', newValues);
                    }}
                  />
                </Grid>
                <Grid container item xs={12} md={3} justifyContent="flex-end">
                  <Button fullWidth type="submit" variant="contained" color="primary">
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

export default NoteForm;
