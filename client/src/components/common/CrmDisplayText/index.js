import PropTypes from 'prop-types';
import { ListItemText, makeStyles } from '@material-ui/core';
import moment from 'moment';

const setDateOrNa = (date) => {
  return date ? moment(date).format('L') : 'N/A';
};

const setValueOrNa = (value) => {
  return value ? value : 'N/A';
};

const CrmDisplayText = ({ primary, secondary, style, type }) => {
  const useStyles = makeStyles((theme) => ({
    primaryClass: { fontSize: 12 },
    secondaryClass: {
      fontSize: 14,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  }));
  const { primaryClass, secondaryClass } = useStyles();

  return (
    <ListItemText
      primaryTypographyProps={{ className: primaryClass }}
      secondaryTypographyProps={{ className: secondaryClass }}
      primary={primary}
      secondary={
        type === 'date' ? setDateOrNa(secondary) : type === 'text' ? setValueOrNa(secondary) : 'N/A'
      }
      style={style}
    />
  );
};

CrmDisplayText.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
};

export default CrmDisplayText;
