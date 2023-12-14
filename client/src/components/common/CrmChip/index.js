import PropTypes from 'prop-types';
import { makeStyles, Chip } from '@material-ui/core';
import Tooltip from 'src/components/common/ToolTip';

const CrmChip = ({ label, selectLabel, ...props }) => {
  const useStyles = makeStyles((theme) => ({
    chipClass: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      marginBottom: 4,
      marginRight: 4,
      color: 'white !important',
      backgroundColor: `${theme.palette.primary.main} !important`,
      fontSize: 12,
      '& .MuiChip-label': {
        paddingTop: 3,
      },
      '& .MuiChip-deleteIconSmall': {
        color: 'white',
        opacity: 0.4,
      },
    },
  }));

  const { chipClass } = useStyles();
  return (
    <Tooltip arrow title={label} placement="top-start">
      <Chip {...props} size="small" className={chipClass} label={label} />
    </Tooltip>
  );
};

CrmChip.propTypes = {
  label: PropTypes.string.isRequired,
  selectLabel: PropTypes.string,
  props: PropTypes.shape({
    className: PropTypes.string.isRequired,
    dataTagIndex: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired,
  }),
};

export default CrmChip;
