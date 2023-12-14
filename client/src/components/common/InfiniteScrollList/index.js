import React, { useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { List, makeStyles, Typography, Box } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  loading: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  list: {
    paddingTop: 0,
  },
}));

const InfiniteScrollList = ({ children, isLoading, getMore, total, noMore }) => {
  const scrollBarRef = useRef(null);
  const classes = useStyles();
  const container = scrollBarRef.current;

  const handleScroll = () => {
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;

      if (scrollHeight - scrollTop === clientHeight && clientHeight !== 0 && !isLoading) {
        getMore();
      }
    }
  };

  return (
    <PerfectScrollbar
      containerRef={(ref) => {
        scrollBarRef.current = ref;
      }}
      onYReachEnd={handleScroll}
    >
      {total === 0 ? (
        <Box py={2}>
          <Typography variant="subtitle2" color="textSecondary" align="center">
            No results found
          </Typography>
        </Box>
      ) : (
        <List className={clsx(isLoading && classes.loading, classes.list)}>{children}</List>
      )}
      {noMore && total > 0 && (
        <Box py={2}>
          <Typography variant="subtitle2" color="textSecondary" align="center">
            No more results
          </Typography>
        </Box>
      )}
    </PerfectScrollbar>
  );
};

export default InfiniteScrollList;
