import { useState, useEffect } from 'react';
import { Card, Box, makeStyles, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import isPastDate from 'src/utils/isPastDate';
import ProviderSelect from 'src/components/common/ProviderSelect';

const useStyles = makeStyles((theme) => ({
  datePickerClass: {
    '& .MuiFormHelperText-root': {
      display: 'none',
    },
  },
}));

const Provider = ({ provider: initialProvider, followUpDate: initialFollowUpDate, patientId }) => {
  const [followUpDate, setFollowUpDate] = useState(null);
  const [hasFollowUpDateError, setHasFollowUpDateError] = useState(false);
  const { datePickerClass } = useStyles();

  const handleSaveNewProvider = async (newOption) => {
    try {
      const { data: patient } = await axios.put(`/api/patients/${patientId}`, {
        providerId: newOption.id,
      });
    } catch (error) {
      toast.error(`Error updating provider`);

      throw error;
    }
  };

  const handleSubmitFollowUpDate = async (value) => {
    try {
      let date = null;
      if (value) {
        date = moment(value).utc().startOf('day').format();
      }

      await axios.put(`/api/patients/${patientId}`, {
        followUpDate: date,
      });

      setFollowUpDate(value);
    } catch (error) {
      toast.error(`Error updating Follow up Date`);
      throw error;
    }
  };

  const handleChange = (newValue) => {
    handleSaveNewProvider(newValue);
  };

  useEffect(() => {
    if (initialFollowUpDate) {
      // Set intial date to
      const adjustedDate = moment.parseZone(initialFollowUpDate).format('MM/DD/YYYY') || null;

      setFollowUpDate(adjustedDate);
      if (isPastDate(adjustedDate)) {
        setHasFollowUpDateError(true);
      }
    }
  }, [initialFollowUpDate]);

  return (
    <Card>
      <Box p={2}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12} lg={6}>
            <Box mt={1}>
              <ProviderSelect
                label="Provider"
                provider={initialProvider}
                handleChange={(newValue) => {
                  handleChange(newValue);
                }}
              />
            </Box>
          </Grid>
          <Grid item lg={6} xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                error={hasFollowUpDateError}
                className={datePickerClass}
                disableToolbar
                variant="outlined"
                format="MM/dd/yyyy"
                margin="normal"
                inputVariant="outlined"
                id="format-date"
                label="Date"
                value={followUpDate}
                minDate={new Date()}
                fullWidth
                InputProps={{ shrink: 'true' }}
                onChange={(followUpDate) => {
                  // Validate the date

                  if (!isPastDate(followUpDate) || null) {
                    // setHasFollowUpDateError(false);
                    handleSubmitFollowUpDate(followUpDate);
                  } else {
                    // setHasFollowUpDateError(true);
                  }
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default Provider;
