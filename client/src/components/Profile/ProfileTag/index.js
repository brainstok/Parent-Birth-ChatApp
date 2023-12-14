import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Grid, Link, Divider, Typography, makeStyles, Checkbox } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  complete: {
    opacity: 0.5,
  },
  tagBodyClass: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const ProfileTag = ({ note, hasDivider, handleIsCompleted }) => {
  const classes = useStyles();

  const { isCompleted, patientNote } = note;
  const { body, createdAt, patientId } = patientNote;
  const { complete, tagBodyClass } = classes;

  return (
    <>
      <Grid item xs={1}>
        <Checkbox
          color="primary"
          checked={isCompleted}
          onChange={(e) => handleIsCompleted(e.target.checked, note)}
        />
      </Grid>
      <Grid item container xs={10} md={11} spacing={1} className={isCompleted ? complete : ''}>
        <Link
          color="textPrimary"
          component={RouterLink}
          to={`/patients/${patientId}`}
          underline="none"
          className={tagBodyClass}
        >
          <Grid item xs={12}>
            <Typography variant="h5">Patient-{patientId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" className={tagBodyClass}>
              {body}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textPrimary">
              {moment(createdAt).fromNow()}
            </Typography>
          </Grid>
        </Link>
      </Grid>

      {hasDivider ? (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      ) : null}
    </>
  );
};

export default ProfileTag;

ProfileTag.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    patientNote: PropTypes.shape({
      id: PropTypes.number.isRequired,
      body: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
  }),
  hasDivider: PropTypes.bool.isRequired,
  handleIsCompleted: PropTypes.func.isRequired,
};
