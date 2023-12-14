import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDevice from 'src/utils/useDevice';
import { makeStyles, Container, Grid, Typography, Box, Card } from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/common/Page';
import TopInfo from 'src/components/Patient/TopInfo';
import Stats from 'src/components/Patient/Stats';
import Topics from 'src/components/Patient/Topics';
import Provider from 'src/components/Patient/Provider';
import Forms from 'src/components/Patient/Forms';
import Loader from 'src/components/common/Loader';
import Timeline from 'src/components/Patient/Timeline';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
}));

const Patient = () => {
  const pageRef = useRef(null);
  const classes = useStyles();
  const { patientId } = useParams();
  const { isMobile } = useDevice();

  const [patient, setPatient] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const getAndSetPatient = async () => {
    try {
      setIsLoading(true);
      const { data: patient } = await axios.get(`/api/patients/${patientId}`);
      setPatient(patient);

      if (!patient) {
        setNotFound(true);
      }
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      getAndSetPatient();
    })();
  }, []);

  const {
    ageRange,
    birthInterventions,
    birthWeeksGestation,
    currentStage,
    dateOfBirth,
    displayName,
    dueDate,
    email,
    ethnicIdentity,
    followUpDate,
    genderIdentity,
    hasBirthPlan,
    hasFirstTrimesterVisit,
    hasInPersonDoulaInterest,
    hasInsurance,
    hasMedicalCareProvider,
    hasNicu,
    insuranceType,
    liveBirthAmount,
    miscarriageAmount,
    partner,
    patientEvents,
    feeding,
    patientNotes,
    phoneNumber,
    birthPlace,
    postpartumCareVisit,
    pregnancyAmount,
    provider,
    sdoh,
    signupStage,
    status,
    patientTopics,
    weeksGestation,
    weeksPostpartum,
    patientForms,
    zipCode,
    pmad,
    hasPmad,
    city,
    state,
    locale,
  } = patient || {};

  return (
    <Page className={classes.root} title="Patients" ref={pageRef}>
      <Container disableGutters={isMobile && true} maxWidth="xl">
        {hasError && !isLoading && (
          <Card>
            <Box p={3}>
              <Typography align="center" error>
                Error loading patient
              </Typography>
            </Box>
          </Card>
        )}

        {notFound && !isLoading && (
          <Card>
            <Box p={3}>
              <Typography align="center" error>
                Patient not found
              </Typography>
            </Box>
          </Card>
        )}

        {!patient && isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <Loader />
          </Box>
        )}

        {patient && !isLoading && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopInfo
                displayName={displayName}
                email={email}
                phoneNumber={phoneNumber}
                currentStage={currentStage}
                status={status}
                patientId={patientId}
                partner={partner}
                zipCode={zipCode}
                city={city}
                state={state}
                locale={locale}
              />
            </Grid>

            <Grid container item md={8} sm={12} alignContent="flex-start">
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <Stats
                    patientId={patientId}
                    hasInPersonDoulaInterest={hasInPersonDoulaInterest}
                    pregnancyAmount={pregnancyAmount}
                    liveBirthAmount={liveBirthAmount}
                    miscarriageAmount={miscarriageAmount}
                    hasInsurance={hasInsurance}
                    insuranceType={insuranceType}
                    hasBirthPlan={hasBirthPlan}
                    hasMedicalCareProvider={hasMedicalCareProvider}
                    postpartumCareVisit={postpartumCareVisit}
                    hasNicu={hasNicu}
                    birthPlace={birthPlace}
                    feeding={feeding}
                    hasFirstTrimesterVisit={hasFirstTrimesterVisit}
                    birthInterventions={birthInterventions}
                    dueDate={dueDate}
                    dateOfBirth={dateOfBirth}
                    ageRange={ageRange}
                    ethnicIdentity={ethnicIdentity}
                    genderIdentity={genderIdentity}
                    signupStage={signupStage}
                    sdoh={sdoh}
                    weeksGestation={weeksGestation}
                    birthWeeksGestation={birthWeeksGestation}
                    weeksPostpartum={weeksPostpartum}
                    pmad={pmad}
                    hasPmad={hasPmad}
                    getAndSetPatient={getAndSetPatient}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Forms patientForms={patientForms} patientId={patientId} />
                </Grid>
                <Grid item xs={12}>
                  <Topics patientTopics={patientTopics} patientId={patientId} />
                </Grid>
              </Grid>
            </Grid>

            <Grid container item md={4} sm={12} alignItems="flex-start">
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <Provider followUpDate={followUpDate} provider={provider} patientId={patientId} />
                </Grid>
                <Grid item xs={12}>
                  <Timeline patientId={patientId} notes={patientNotes} events={patientEvents} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
    </Page>
  );
};

export default Patient;
