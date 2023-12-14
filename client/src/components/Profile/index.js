import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from 'src/context/UserContext';
import axios from 'axios';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import ProfileTag from './ProfileTag';
import Loader from '../common/Loader';

const useStyles = makeStyles((theme) => ({
  profileHeader: {
    paddingTop: theme.spacing(10),
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: '50%',
    fontSize: theme.spacing(7),
    backgroundColor: theme.palette.primary.main,
  },
  cardHeader: {
    borderBottom: `1px solid ${theme.palette.background.dark}`,
  },
}));

const updateNote = async (isCompleted, noteId, providerId) => {
  try {
    const { data } = await axios.put(`api/users/provider/${providerId}/tags/${noteId}`, {
      isCompleted,
    });

    return data;
  } catch (error) {
    return error;
  }
};

const Profile = () => {
  const { user: provider, setUserTags } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const { profileHeader, avatar, cardHeader, toggleButtonGroup } = classes;

  const {
    id: providerId,
    firstName,
    lastName,
    avatarLink,
    role,
    name,
    tags: initialTags,
  } = provider || {};

  const initials = ((firstName, lastName, name) => {
    if (firstName && lastName) {
      return firstName[0] + lastName[0];
    } else if (name) {
      return name[0];
    } else {
      return '?';
    }
  })(firstName, lastName, name);

  const handleIsCompleted = async (isCompleted, note) => {
    const { id: noteId } = note;

    try {
      setIsLoading(true);
      const updatedNotes = await updateNote(isCompleted, noteId, providerId);

      setUserTags(updatedNotes);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTags?.length) {
      setNotes(initialTags);
    }
  }, [initialTags]);

  return (
    <Card>
      {!Boolean(provider) && (
        <CardContent>
          <Grid justifyContent="center" container>
            {isLoading && <Loader />}
            {!isLoading && <Typography variant="h5">There is no provider to display</Typography>}
          </Grid>
        </CardContent>
      )}
      {Boolean(provider) && (
        <>
          <Grid
            className={profileHeader}
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Grid item>
              <Avatar
                className={avatar}
                alt="provider profile"
                variant="rounded"
                src={avatarLink || null}
              >
                {!avatarLink && initials}
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h2">
                {firstName} {lastName}
              </Typography>
            </Grid>
            <Grid item>
              <Chip color="primary" label={role ? role : `Provider - ${providerId}`} size="small" />
            </Grid>
          </Grid>
          <CardHeader
            title="Tags"
            className={cardHeader}
            titleTypographyProps={{ variant: 'h4' }}
            action={
              <ToggleButtonGroup
                className={toggleButtonGroup}
                value={filter}
                exclusive
                onChange={(e, value) => {
                  if (value === null) return;
                  setFilter(value);
                }}
              >
                <ToggleButton value={'all'}>All</ToggleButton>
                <ToggleButton value={'todo'}>To-Do</ToggleButton>
              </ToggleButtonGroup>
            }
          />
          <CardContent>
            <Grid container spacing={1} alignItems="center" justifyContent="space-between">
              {Boolean(notes?.length) && (
                <>
                  {Boolean(filter === 'all') &&
                    notes.map((note, index) => {
                      const hasDivider = notes.length > index + 1;
                      return (
                        <ProfileTag
                          key={note.id}
                          note={note}
                          handleIsCompleted={handleIsCompleted}
                          hasDivider={hasDivider}
                        />
                      );
                    })}

                  {Boolean(filter === 'todo') &&
                    notes
                      .filter((note) => note.isCompleted === false)
                      .map((note, index, filteredNotes) => {
                        const hasDivider = filteredNotes.length > index + 1;
                        return (
                          <ProfileTag
                            key={note.id}
                            note={note}
                            handleIsCompleted={handleIsCompleted}
                            hasDivider={hasDivider}
                          />
                        );
                      })}

                  {Boolean(filter === 'todo') &&
                    !notes.filter((note) => note.isCompleted === false).length && (
                      <Grid item container justifyContent="center">
                        <Typography>Congratulations! You are all caught up. {'🎉'}</Typography>
                      </Grid>
                    )}
                </>
              )}

              {!Boolean(notes?.length) && (
                <Grid item container justifyContent="center">
                  <Typography>There are no tags to display</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Profile;

Profile.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarLink: PropTypes.string,
    role: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        patientId: PropTypes.number.isRequired,
        body: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        taggedProviderIds: PropTypes.arrayOf(PropTypes.number.isRequired),
      })
    ),
  }),
};
