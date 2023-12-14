import React from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  heading: {
    fontSize: 80,
    color: theme.palette.ternary.main,
  },
  subHeading: {
    fontSize: 30,
    color: theme.palette.ternary.main,
  },
}));

const Content = () => {
  const classes = useStyles();
  return <Box className={classes.box}></Box>;
};

export default Content;
