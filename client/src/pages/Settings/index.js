import {
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  Divider,
} from '@material-ui/core';
import Page from 'src/components/common/Page';
import MessagesForm from 'src/components/Settings/MessageForm';
import AwayToggle from 'src/components/Settings/AwayToggle';
import useDevice from 'src/utils/useDevice';

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

const Settings = () => {
  const classes = useStyles();
  const { isMobile } = useDevice();

  return (
    <Page className={classes.root} title="Settings" ref={null}>
      <Container disableGutters={isMobile && true} maxWidth="sm">
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item>
                <Typography variant="h4">Settings</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <AwayToggle />
              </Grid>
              <Grid item xs={12}>
                <MessagesForm />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default Settings;
