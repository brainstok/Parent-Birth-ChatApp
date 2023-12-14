import { Card, Box, Typography, makeStyles, Grid, IconButton, SvgIcon } from '@material-ui/core';
import moment from 'moment';
import CrmDisplayText from 'src/components/common/CrmDisplayText';
import CrmDisplayChips from 'src/components/common/CrmDisplayChips';
import { Edit as EditIcon, Save as SaveIcon } from 'react-feather';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  topNumberClass: {
    lineHeight: 0.8,
    fontSize: 18,
  },
  iconClass: {
    fontSize: '1rem',
  },
  timeInputClass: {
    '& label + .MuiInput-formControl': {
      marginTop: 0,
      maxWidth: 140,
    },
    '& .MuiInputLabel-formControl': {
      transform: 'translate(0, 4px) scale(1)',
    },

    '& .MuiInputBase-input': {
      padding: '2px 0 2px',
    },

    '& .MuiSvgIcon-root': {
      width: 20,
      height: 20,
    },

    '& label': {
      display: 'none',
    },
  },
}));

const submitDate = async ({ patientId, dueDate, dateOfBirth }) => {
  try {
    await axios.put(`/api/patients/${patientId}/date`, {
      dueDate,
      dateOfBirth,
    });
  } catch (error) {
    throw error;
  }
};

const Stats = ({
  dueDate: initialDueDate,
  dateOfBirth: initialDateOfBirth,
  sdoh = [],
  ageRange,
  birthWeeksGestation,
  ethnicIdentity,
  genderIdentity,
  signupStage,
  weeksGestation,
  weeksPostpartum,
  patientId,
  hasInPersonDoulaInterest,
  pregnancyAmount,
  liveBirthAmount,
  miscarriageAmount,
  hasInsurance,
  insuranceType,
  hasBirthPlan,
  hasMedicalCareProvider,
  postpartumCareVisit,
  hasNicu,
  birthPlace,
  feeding,
  hasBreastfed,
  hasFirstTrimesterVisit,
  birthInterventions,
  pmad,
  hasPmad,
  getAndSetPatient,
}) => {
  const { topNumberClass, iconClass, timeInputClass } = useStyles();
  const [editing, setEditing] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const setDateOrNa = (date) => {
    return date ? moment(date).format('L') : 'N/A';
  };

  const setValueOrNa = (value) => {
    return value !== null ? value : 'N/A';
  };

  const handleSaveDate = async (date, type) => {
    if (type === 'dueDate') {
      setDueDate(date);
    }

    if (type === 'dateOfBirth') {
      setDateOfBirth(date);
    }

    await submitDate({
      patientId,
      [type]: date,
    });

    setEditing(null);
  };

  useEffect(() => {
    setDueDate(initialDueDate);
    setDateOfBirth(initialDateOfBirth);
  }, [initialDueDate, initialDateOfBirth]);

  return (
    <Card>
      <Box p={2}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Box display="flex" flexDirection="column" alignItems="center">
              {editing === 'dueDate' ? (
                <Box display="flex">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      format="MM/dd/yyyy"
                      id="format-date"
                      label="Baby Due Date"
                      value={dueDate}
                      fullWidth
                      className={timeInputClass}
                      onChange={() => {}}
                      onAccept={(date) => {
                        handleSaveDate(date, 'dueDate');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Box>
              ) : (
                <Box display="flex" alignItems="center">
                  <Typography variant="h4" color="primary" className={topNumberClass}>
                    {setDateOrNa(dueDate)}
                  </Typography>

                  <IconButton
                    onClick={() => {
                      setEditing('dueDate');
                    }}
                    size="small"
                  >
                    <SvgIcon className={iconClass} fontSize="small">
                      <EditIcon />
                    </SvgIcon>
                  </IconButton>
                </Box>
              )}
              <Typography variant="overline">Baby Due Date</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h4" color="primary" className={topNumberClass} gutterBottom>
                {setValueOrNa(weeksGestation)}
              </Typography>
              <Typography variant="overline">Weeks Gestation</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" flexDirection="column" alignItems="center">
              {editing === 'dateOfBirth' ? (
                <Box display="flex">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      format="MM/dd/yyyy"
                      id="format-date"
                      label="Birth Date"
                      value={dateOfBirth}
                      fullWidth
                      className={timeInputClass}
                      onChange={() => {}}
                      onAccept={(date) => {
                        handleSaveDate(date, 'dateOfBirth');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Box>
              ) : (
                <Box display="flex" alignItems="center">
                  <Typography variant="h4" color="primary" className={topNumberClass}>
                    {setDateOrNa(dateOfBirth)}
                  </Typography>

                  <IconButton
                    onClick={() => {
                      setEditing('dateOfBirth');
                    }}
                    size="small"
                  >
                    <SvgIcon className={iconClass} fontSize="small">
                      <EditIcon />
                    </SvgIcon>
                  </IconButton>
                </Box>
              )}
              <Typography variant="overline">Baby Date of Birth</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h4" color="primary" className={topNumberClass} gutterBottom>
                {setValueOrNa(weeksPostpartum)}
              </Typography>
              <Typography variant="overline">Weeks Postpartum</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={{ xs: 2, md: 5 }}>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Signup Stage" secondary={signupStage?.label} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText primary={'Age'} type="text" secondary={ageRange} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary={'Ethnic Identity'} secondary={ethnicIdentity} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary={'Gender Identity'} secondary={genderIdentity} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText
              primary={'Interested in IP Doula'}
              type="text"
              secondary={hasInPersonDoulaInterest}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Past Pregnancies" secondary={pregnancyAmount} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText primary="Prior Live Births" type="text" secondary={liveBirthAmount} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText
              primary={'Prior Miscarriages'}
              type="text"
              secondary={miscarriageAmount}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Has Insurance" secondary={hasInsurance} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Insurance Type" secondary={insuranceType} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Has Birth Plan" secondary={hasBirthPlan} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText
              primary="Has Medical Care Provider"
              type="text"
              secondary={hasMedicalCareProvider}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText
              type="text"
              primary="First Trimester Visit"
              secondary={hasFirstTrimesterVisit}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText
              type="text"
              primary="Postpartum Care Visit"
              secondary={postpartumCareVisit}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Has NICU" secondary={hasNicu} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText
              primary="Birth Weeks Gestation"
              type="text"
              secondary={birthWeeksGestation}
            />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayChips values={birthInterventions} label="Birth Interventions" />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Place of Birth" secondary={birthPlace} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayChips values={feeding} label="Feeding" />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Has Breastfed" secondary={hasBreastfed} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayChips values={sdoh} label="SDOH" />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText type="text" primary="Has PMAD" secondary={hasPmad} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayChips values={pmad} label="PMAD" />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default Stats;
