import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
  makeStyles,
  Button,
  Avatar,
} from '@material-ui/core';
import Page from '../common/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },

  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80,
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    position: 'absolute',
    top: -25,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 70,
  },
}));

const Login = () => {
  const classes = useStyles();
  const { loginWithRedirect } = useAuth0();

  return (
    <Page className={classes.root} title="Login">
      <Container className={classes.cardContainer} maxWidth="sm">
        <Box mb={8} position="relative">
          <Avatar className={classes.avatar} variant="rounded" src="/static/images/avatar.png">
            Robyn
          </Avatar>
          <Card>
            <CardContent className={classes.cardContent}>
              <Box>
                <Typography color="textPrimary" align="center" gutterBottom variant="h2">
                  Sign into ParentBirth
                </Typography>
              </Box>

              <Box mb={3}>
                <Divider />
              </Box>

              <Button onClick={() => loginWithRedirect()} variant="contained" color="primary">
                Log in
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default Login;
