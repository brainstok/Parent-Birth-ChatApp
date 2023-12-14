import React, { useContext } from 'react';
import { ResourceContext } from 'src/context/ResourceContext';
import { makeStyles, Grid, Typography, Divider, Chip, Button, Link } from '@material-ui/core';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  resourceContainer: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
  viewButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  viewButton: {
    paddingTop: '0.625rem',
    paddingRight: '1.25rem',
    paddingBottom: '0.625rem',
    paddingLeft: '1.25rem',
  },
}));

const ResourceResult = ({
  resource: { id, title, body, updatedAt, resourceTopic, resourceSubtopics },
  hasDivider,
}) => {
  const { setReset } = useContext(ResourceContext);
  const classes = useStyles();
  return (
    <Grid container item justifyContent="space-between" xs={12}>
      <Grid item container spacing={1} xs={12} md={10}>
        <Grid item xs={12}>
          <Typography variant="h4">
            <Link
              variant="subtitle1"
              color="textPrimary"
              component={RouterLink}
              underline="none"
              to={`/resource-library/${id}`}
            >
              {title}
            </Link>
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Last Updated: {moment(updatedAt).format('MMMM Do YYYY')}
          </Typography>
        </Grid>
        {resourceTopic?.id ? (
          <Grid container item spacing={1}>
            <Grid item>
              <Chip label={resourceTopic.label} color="primary" />
            </Grid>
            {resourceSubtopics?.map((subtopic) => (
              <Grid key={subtopic.id} item>
                <Chip label={subtopic.label} color="primary" />
              </Grid>
            ))}
          </Grid>
        ) : null}
        <Grid item>
          <Typography color="textSecondary">{`${body.substring(0, 300)} ...`}</Typography>
        </Grid>
      </Grid>
      <Grid item className={classes.viewButtonContainer} xs={12} md={1}>
        <Link
          variant="subtitle1"
          color="textPrimary"
          component={RouterLink}
          to={`/resource-library/${id}`}
          underline="none"
        >
          <Button
            onClick={setReset}
            className={classes.viewButton}
            fullWidth
            variant="contained"
            color="primary"
          >
            View
          </Button>
        </Link>
      </Grid>
      {hasDivider ? (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default ResourceResult;
