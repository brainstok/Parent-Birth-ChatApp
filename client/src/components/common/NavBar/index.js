/* eslint-disable no-use-before-define */
import React, { Fragment, useEffect, useContext } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { UserContext } from 'src/context/UserContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Hidden, List, ListSubheader, makeStyles } from '@material-ui/core';
import {
  Chat as ChatIcon,
  People as PeopleIcon,
  LocalHospital as ProviderIcon,
  Face as FaceIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  BookSharp as BookIcon,
  FolderShared as FolderIcon,
} from '@material-ui/icons';
import NavItem from './NavItem';
import Profile from './Profile';

const sections = [
  {
    items: [
      {
        title: 'SMS Chat',
        icon: ChatIcon,
        href: `/chat`,
      },
      {
        title: 'Send Mass Text',
        icon: ChatIcon,
        href: `/mass-text`,
      },
      {
        title: 'Patients',
        icon: PeopleIcon,
        href: `/patients`,
      },
      {
        title: 'Providers',
        icon: ProviderIcon,
        href: `/providers`,
      },
      {
        title: 'Settings',
        icon: SettingsIcon,
        href: `/settings`,
      },
      {
        title: 'Resource Library',
        icon: BookIcon,
        href: `/resource-library`,
      },
      {
        title: 'Doula Directory',
        icon: FolderIcon,
        href: `/doula-directory`,
      },
    ],
  },
];

function renderNavItems({ items, pathname, depth = 0, isUserAdmin }) {
  return (
    <List disablePadding>
      {items.reduce((acc, item) => {
        if (!isUserAdmin && item.title === 'Mass text') {
          return acc;
        }
        return reduceChildRoutes({ acc, item, pathname, depth });
      }, [])}
    </List>
  );
}

function reduceChildRoutes({ acc, pathname, item, depth }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <Fragment key={key}>
        <NavItem
          depth={depth}
          href={item.href}
          icon={item.icon}
          info={item.info}
          title={item.title}
        />
        {item.hasDivider && <Divider />}
      </Fragment>
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { isUserAdmin } = useContext(UserContext);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Box p={2}>
          {sections.map((section, i) => {
            return (
              <List
                key={i}
                subheader={
                  <ListSubheader disableGutters disableSticky>
                    {section.subheader}
                  </ListSubheader>
                }
              >
                {renderNavItems({
                  items: section.items,
                  pathname: location.pathname,
                  isUserAdmin,
                })}
              </List>
            );
          })}
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
          <Profile />
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          {content}
          <Profile />
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
