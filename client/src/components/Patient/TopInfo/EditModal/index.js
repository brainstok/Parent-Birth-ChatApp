import React, { useState } from 'react';
import PhoneField from 'src/components/common/PhoneField';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Loader from 'src/components/common/Loader';
import {
  Dialog,
  DialogTitle,
  Divider,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Button,
  Box,
  FormHelperText,
} from '@material-ui/core';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  phoneNumber: Yup.string().required('Required'),
  email: Yup.string().email().nullable(),
});

const updatePatient = async ({ values, patientId }) => {
  try {
    const { data: updatedPatient } = await axios.put(`/api/patients/${patientId}`, values);

    return updatedPatient;
  } catch (error) {
    throw error;
  }
};

const EditModal = ({ isOpen, patientValues, setPatientValues, setIsEditModalOpen, patientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdatePatient = async (values) => {
    try {
      const updatedPatient = await updatePatient({ values, patientId });

      setPatientValues(updatedPatient);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await handleUpdatePatient(values);
    } catch (error) {
      let errorMessage = error.message;
      if (error.response) {
        const { data: message } = error.response;
        errorMessage = message;
      }
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setErrorMessage('');
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Edit Patient</DialogTitle>
      <Box mb={2}>
        <Divider />
      </Box>

      <DialogContent>
        {isLoading && (
          <Box
            minHeight={300}
            minWidth={400}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Loader />
          </Box>
        )}
        {!isLoading && (
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
              patientValues
                ? patientValues
                : { firstName: '', lastName: '', email: '', phoneNumber: '' }
            }
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, handleSubmit }) => {
              return (
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="First Name *"
                        name="firstName"
                        value={values.firstName}
                        error={Boolean(errors.firstName)}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Last Name *"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={Boolean(errors.lastName)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <PhoneField
                        fullWidth
                        variant="outlined"
                        label="Phone *"
                        name="phoneNumber"
                        value={values?.phoneNumber}
                        onChange={(phoneNumber) => setFieldValue(`phoneNumber`, phoneNumber)}
                        error={Boolean(errors.phoneNumber)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                  <FormHelperText error>{errorMessage}</FormHelperText>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" color="primary" variant="contained">
                      Save Changes
                    </Button>
                  </DialogActions>
                </form>
              );
            }}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
