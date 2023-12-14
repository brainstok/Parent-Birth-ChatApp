import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles, Box, Container } from '@material-ui/core';
import Page from 'src/components/common/Page';
import Loader from 'src/components/common/Loader';
import ProvidersTable from 'src/components/Providers/Table';
import { UserContext } from 'src/context/UserContext';
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

const LoadingContent = () => (
  <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
    <Loader />
  </Box>
);

const getProviders = async () => {
  try {
    const { data: providers } = await axios.get('/api/users/providers');
    return providers;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const Providers = () => {
  const classes = useStyles();
  const pageRef = useRef(null);
  const { isMobile } = useDevice();
  const [providers, setProviders] = useState([]);
  const { isUserAdmin } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const providers = await getProviders();
      setProviders(providers);
    })();
  }, []);

  return (
    <Page className={classes.root} title="Providers" ref={pageRef}>
      <Container disableGutters={isMobile && true} maxWidth={false}>
        <ProvidersTable
          isUserAdmin={isUserAdmin}
          providers={providers}
          setProviders={setProviders}
        />
      </Container>
    </Page>
  );
};

export default Providers;
