import useDevice from 'src/utils/useDevice';
import {
  Box,
  Grid,
  Avatar,
  Typography,
  Divider,
  makeStyles,
  Button,
  Icon,
} from '@material-ui/core';
import { LocationOn as LocationOnIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  avatarClass: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    backgroundColor: theme.palette.primary.main,
  },
  locationIconClass: {
    color: theme.palette.primary.main,
    width: theme.spacing(3),
    height: theme.spacing(3),
    paddingRight: theme.spacing(4),
  },
  viewButtonClass: {
    paddingTop: '0.625rem',
    paddingRight: '1.25rem',
    paddingBottom: '0.625rem',
    paddingLeft: '1.25rem',
  },
}));

const DoulaItem = ({ doula }) => {
  const classes = useStyles();
  const { isMobile } = useDevice();

  const { profilePicture, firstName, lastName, city, state, zipCode, link } = doula;

  const { url: imageUrl } = profilePicture || {};

  const { avatarClass, locationIconClass, viewButtonClass } = classes;

  return (
    <>
      <Box marginX={3} marginY={2}>
        <Grid
          container
          alignItems="center"
          spacing={3}
          justifyContent={isMobile ? 'flex-start' : 'space-between'}
        >
          {/* Avatar and Contact Info */}
          <Grid item container alignItems="center" xs={12} sm={10}>
            {/* Avatar */}
            <Grid item xs={3}>
              <Avatar
                className={avatarClass}
                src={imageUrl || ''}
                alt={`Profile of ${firstName} ${lastName}`}
              />
            </Grid>
            {/* Contact Info */}
            <Grid item container alignItems="center" xs={9}>
              {/* NAME */}
              <Grid item xs={12}>
                <Typography variant="h4">
                  {firstName} {lastName} {}
                </Typography>
              </Grid>
              {/* LOCATION */}
              <Grid item container xs={12}>
                <Icon className={locationIconClass} color="primary">
                  <LocationOnIcon />
                </Icon>
                <Typography variant="h6">
                  {city}, {state} {zipCode}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              className={viewButtonClass}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="primary"
            >
              View
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider />
    </>
  );
};

export default DoulaItem;
