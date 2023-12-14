import React, { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Loader from 'src/components/common/Loader';
import { MODALITIES } from 'src/constants';
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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';

const getValidationSchema = (isEditing) =>
  Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email().required('Required'),
    password: isEditing ? '' : Yup.string().required('Required'),
  });

const addProvider = async ({ values, token }) => {
  try {
    const { data: newProvider } = await axios.post(`/api/users/providers`, values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return newProvider;
  } catch (error) {
    throw error;
  }
};

const updateProvider = async ({ userId, values }) => {
  const { data: updatedProvider } = await axios.put(`/api/users/providers/${userId}`, values);
  return updatedProvider;
};

const AddEditModal = ({ isOpen, setIsOpen, providers, setProviders, provider, setProvider }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isEditing = Boolean(provider);

  const handleAddProvider = async (values) => {
    try {
      const newProvider = await addProvider({ values });
      const updatedProviders = [...providers, newProvider];
      setProviders(updatedProviders);
      setIsOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateProvider = async (values) => {
    const updatedProvider = await updateProvider({
      userId: provider.id,
      values,
    });
    const updatedProviders = [...providers];
    const providerIndex = updatedProviders.findIndex(
      (provider) => provider.id === updatedProvider.id
    );
    updatedProviders[providerIndex] = updatedProvider;

    //   Reset Form
    setProvider(null);
    setProviders(updatedProviders);
    setIsOpen(false);
  };

  const handleSubmit = async (values) => {
    // setIsLoading(true);
    try {
      if (isEditing) {
        await handleUpdateProvider(values);
      } else {
        await handleAddProvider(values);
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.response) {
        const { data: message } = error.response;
        errorMessage = message;
      }
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const intitalValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: '',
    modalityId: '',
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{isEditing ? 'Edit' : 'Add'} Provider</DialogTitle>
      <Divider />
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
            validationSchema={getValidationSchema(isEditing)}
            enableReinitialize
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={provider ?? intitalValues}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, errors, handleSubmit, setFieldValue, resetForm }) => {
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
                        label="Email *"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="modality">Focus</InputLabel>
                        <Select
                          labelId="modality"
                          id="modality"
                          value={values.modalityId || ''}
                          label="Modality"
                          onChange={(e) => setFieldValue('modalityId', e.target.value)}
                        >
                          {Object.entries(MODALITIES).map((modalities) => (
                            <MenuItem key={modalities[0]} value={modalities[0]}>
                              {modalities[1]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Password *"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="avatar"
                        label="Profile Image Link"
                        value={values.avatar}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                  <FormHelperText error>{errorMessage}</FormHelperText>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        resetForm();
                        handleClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                      {isEditing ? 'Save Changes' : 'Add Provider'}
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

export default AddEditModal;
