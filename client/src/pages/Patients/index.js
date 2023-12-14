import React, { useEffect, useRef, useState, useContext } from 'react';
import { UserContext } from 'src/context/UserContext';
import useDevice from 'src/utils/useDevice';
import axios from 'axios';
import { makeStyles, Box, Container, Grid } from '@material-ui/core';
import Page from 'src/components/common/Page';
import Loader from 'src/components/common/Loader';
import PatientTable from 'src/components/Patients/Table';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

const LoadingContent = () => (
  <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
    <Loader />
  </Box>
);

const getPatients = async () => {
  try {
    const { data: patients } = await axios.get('/api/patients');

    return patients;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const Patients = () => {
  const classes = useStyles();
  const { isMobile } = useDevice();
  const pageRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isUserAdmin } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const patients = await getPatients();
        setPatients(patients);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Page className={classes.root} title="Patients" ref={pageRef}>
      <Container disableGutters={isMobile && true} maxWidth={false}>
        {isLoading && <LoadingContent />}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PatientTable
              isUserAdmin={isUserAdmin}
              showAddButton
              title="Active Patients"
              patients={patients}
              setPatients={setPatients}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Patients;
