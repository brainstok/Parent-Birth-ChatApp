import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
  wrapperStyle: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: theme.palette.text.secondary,
    marginLeft: 10,
    fontSize: 14,
  },
}));

const LoadingContent = ({ description, loaderSize, additionalStyle = null }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.wrapperStyle, additionalStyle)}>
      <Loader size={loaderSize} />
      {description && <Typography className={classes.description}>{description}</Typography>}
    </Box>
  );
};

LoadingContent.propTypes = {
  description: PropTypes.string,
  loaderSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LoadingContent;
