import React, { Fragment, useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Dashboard from 'src/layouts/Dashboard';
import { UserContext } from 'src/context/UserContext';
import { CircularProgress, Box } from '@material-ui/core';
import { toast } from 'react-toastify';

// Pages
import Login from 'src/pages/Login';
import Chat from 'src/pages/Chat';
import MassText from 'src/pages/MassText';
import Patients from 'src/pages/Patients';
import Providers from 'src/pages/Providers';
import Patient from 'src/pages/Patient';
import Settings from 'src/pages/Settings';
import ResourceLibrary from 'src/pages/ResourceLibrary';
import Resource from 'src/pages/Resource';
import DoulaDirectory from 'src/pages/DoulaDirectory';
import Profile from 'src/pages/Profile';

const LoadingContent = () => (
  <Box
    position="absolute"
    left="50%"
    top="50%"
    style={{
      transform: 'translate(-50%, -50%)',
    }}
  >
    <CircularProgress />
  </Box>
);

export const renderRoutes = (routes = []) => {
  return (
    <Switch>
      {routes.map((route, i) => {
        const Page = route.page;
        const Layout = route.layout || Fragment;

        const PageWithLayout = () => {
          const { authToken, setAuthToken, setUser } = useContext(UserContext);

          useEffect(() => {
            (async () => {
              try {
                const token = await setAuthToken();

                await setUser(token);
              } catch (error) {
                toast.error(`Error setting user`);
                console.log(error);
              }
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

          return <Layout>{authToken ? <Page /> : <LoadingContent />}</Layout>;
        };

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            component={
              route.isPrivate
                ? withAuthenticationRequired(PageWithLayout, {
                    onRedirecting: () => <span>Loading...</span>,
                  })
                : Page
            }
          />
        );
      })}
    </Switch>
  );
};

const routes = [
  {
    exact: true,
    path: '/',
    page: Login,
    isPrivate: false,
  },
  {
    exact: false,
    path: '/chat',
    page: Chat,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: true,
    path: '/mass-text',
    page: MassText,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: true,
    path: '/patients',
    page: Patients,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: true,
    path: '/providers',
    page: Providers,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: false,
    path: '/patients/:patientId',
    page: Patient,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: true,
    path: '/settings',
    page: Settings,
    isPrivate: true,
    layout: Dashboard,
  },

  {
    exact: false,
    path: '/resource-library/:resourceId',
    page: Resource,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: false,
    path: '/resource-library',
    page: ResourceLibrary,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: false,
    path: '/doula-directory',
    page: DoulaDirectory,
    isPrivate: true,
    layout: Dashboard,
  },
  {
    exact: true,
    path: '/profile',
    page: Profile,
    isPrivate: true,
    layout: Dashboard,
  },
];

export default routes;
