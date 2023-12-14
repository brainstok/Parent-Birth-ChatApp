import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip as MUITooltip } from '@material-ui/core';

const SyledTooltip = withStyles((theme) => ({
  tooltip: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    fontSize: 14,
  },
  arrow: {
    color: theme.palette.secondary.main,
  },
}))(MUITooltip);

const Tooltip = (props) => <SyledTooltip {...props} />;

Tooltip.propTypes = {
  props: PropTypes.shape({
    arrow: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
  }),
};

export default Tooltip;
