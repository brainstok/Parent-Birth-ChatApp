import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  box: {
    background: 'url(static/images/dashboard.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <Box width={'calc(100vw - 255px)'} height={'calc(100vh - 120px)'} className={classes.box} />
  );
};

export default Dashboard;
