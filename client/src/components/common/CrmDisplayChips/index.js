import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import CrmChip from 'src/components/common/CrmChip';
import CrmDisplayText from 'src/components/common/CrmDisplayText';

const CrmDisplayChips = ({ values, label }) => {
  return (
    <Box>
      <Box marginTop="6px">
        <Typography style={{ fontSize: 12 }}>{label}</Typography>
      </Box>
      <Box display="flex">
        {values?.length ? (
          values.map((barrier) => <CrmChip key={barrier.id} label={barrier.label} />)
        ) : (
          <CrmDisplayText style={{ marginTop: 0 }} secondary={'N/A'} />
        )}
      </Box>
    </Box>
  );
};

CrmDisplayChips.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  label: PropTypes.string.isRequired,
};

export default CrmDisplayChips;
