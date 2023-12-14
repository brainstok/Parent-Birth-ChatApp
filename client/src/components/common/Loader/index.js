import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

const Loader = ({ size }) => {
  return <CircularProgress size={size} color="primary" />;
};

Loader.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Loader;
