import React from 'react';
import { Box, Divider, makeStyles } from '@material-ui/core';
import MessageList from '../MessageList';
import MessageComposer from '../MessageComposer';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  box: {
    position: 'relative',
    overflow: 'hidden',
    flexGrow: 1,
    backgroundColor: '#FBFBFB',
  },
}));

const Thread = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.box}>
        <MessageList />
      </Box>
      <Divider />

      <MessageComposer />
    </Box>
  );
};

export default Thread;
