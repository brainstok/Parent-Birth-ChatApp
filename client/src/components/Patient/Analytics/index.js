import { Card, CardContent, Grid } from '@material-ui/core';
import moment from 'moment';
import CrmDisplayText from 'src/components/common/CrmDisplayText';

const Analytics = ({ signupDate, daysOnService, daysActive, averageMessagePerDay }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={3} xs={6}>
            <CrmDisplayText primary="Signup Date" secondary={moment(signupDate).format('L')} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText primary="Days on Service" secondary={daysOnService} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText primary="Days Active" secondary={daysActive} />
          </Grid>
          <Grid item md={3} xs={6}>
            <CrmDisplayText primary="Average Message Per day" secondary={averageMessagePerDay} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Analytics;
