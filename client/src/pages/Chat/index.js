import React, { useContext } from 'react';
import { makeStyles, Box } from '@material-ui/core';
import Page from 'src/components/common/Page';
import Thread from 'src/components/Chat/Thread';
import clsx from 'clsx';
import _ from 'lodash';
import Search from 'src/components/Chat/Search';
import SearchList from 'src/components/Chat/SearchList';
import ThreadList from 'src/components/Chat/ThreadList';
import { ChatContext } from 'src/context/ChatContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
  },
  box: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  sidebar: {
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 320,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      position: 'absolute',
      height: '100%',
      zIndex: 10,
    },
  },
  hideSidebar: {
    display: 'none',
  },
  showThreadButton: {
    padding: 10,
    paddingTop: 12,
    width: '100%',
    borderRadius: 0,
    position: 'absolute',
    zIndex: 10,
    top: 64,
  },
  perfectScrollbar: {
    height: 'calc(100% - 72px)',
  },
}));

const Chat = () => {
  const classes = useStyles();
  const { areThreadsHidden, listDisplayed } = useContext(ChatContext);

  return (
    <Page className={classes.root} title="Chat">
      <Box className={classes.box}>
        <Box className={clsx(classes.sidebar, areThreadsHidden && classes.hideSidebar)}>
          <Search />

          {listDisplayed === 'threads' && <ThreadList />}

          {listDisplayed === 'search' && <SearchList />}
        </Box>

        <Thread />
      </Box>
    </Page>
  );
};

export default Chat;
