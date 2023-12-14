import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Loader from 'src/components/common/Loader';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import {
  Dialog,
  DialogTitle,
  Divider,
  DialogActions,
  DialogContent,
  Grid,
  Button,
  Box,
  FormHelperText,
  Typography,
} from '@material-ui/core';

const DeleteConfirmModal = ({ isOpen, setIsOpen, patient, setPatientToDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();

  const handleDeletePatient = async (patientId) => {
    try {
      await axios.delete(`/api/patients/${patientId}`);
      setIsOpen(false);
      history.push('/patients');
    } catch (error) {
      toast.error(`Error deleting Patient`);
      throw new Error(error.message);
    }
  };

  const handleSubmit = async (patientId) => {
    setIsLoading(true);
    try {
      await handleDeletePatient(patientId);
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
    setPatientToDelete(null);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete Patient</DialogTitle>
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
          <Grid container spacing={2}>
            <Grid item>
              <Typography gutterBottom>
                Are you sure you want to delete {patient?.displayName}?
              </Typography>
            </Grid>
          </Grid>
        )}

        <FormHelperText error>{errorMessage}</FormHelperText>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => handleSubmit(patient.patientId)}
            type="submit"
            color="primary"
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

DeleteConfirmModal.propsTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  setUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteConfirmModal;
