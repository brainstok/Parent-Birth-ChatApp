import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import clsx from 'clsx';
import {
  AppBar,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon,
  Box,
  Button,
} from '@material-ui/core';
import { Menu as MenuIcon, LogOut as LogOutIcon } from 'react-feather';
import io from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 64,
  },
  appBar: {
    backgroundColor: theme.palette.ternary.main,
  },
  img: {
    height: 40,
  },
  switch: {
    '& .MuiSwitch-colorSecondary.Mui-checked': {
      color: theme.palette.error.main,
    },
  },

  hideThreads: {
    color: 'white',
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const { isAuthenticated, logout } = useAuth0();

  return (
    <AppBar className={clsx(className, classes.appBar)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <RouterLink to="/">
            <img className={classes.img} src="/static/images/logo-type-beige.svg" />
          </RouterLink>
        </Hidden>

        <Box ml={2} flexGrow={1} />

        {isAuthenticated && (
          <Hidden mdDown>
            <Button
              color="inherit"
              onClick={() => logout({ returnTo: window.location.origin })}
              startIcon={<LogOutIcon />}
            >
              Log Out
            </Button>
          </Hidden>
        )}
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func.isRequired,
  rest: PropTypes.object,
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {},
};

export default TopBar;
