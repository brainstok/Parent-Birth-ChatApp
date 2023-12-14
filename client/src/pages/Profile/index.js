import useDevice from 'src/utils/useDevice';
import { makeStyles, Container } from '@material-ui/core';
import Page from 'src/components/common/Page';
import Profile from 'src/components/Profile';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
}));

const ProfilePage = () => {
  const { isMobile } = useDevice();
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Profile">
      <Container disableGutters={isMobile && true} maxWidth="md">
        <Profile />
      </Container>
    </Page>
  );
};

export default ProfilePage;
