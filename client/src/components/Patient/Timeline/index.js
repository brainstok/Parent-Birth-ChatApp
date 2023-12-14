import { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardHeader,
  Divider,
  Typography,
  Box,
  Avatar,
  makeStyles,
  Button,
  ButtonGroup,
  Grid,
} from '@material-ui/core';
import { Star as StarIcon } from '@material-ui/icons';
import {
  Timeline as MUITimeline,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from '@material-ui/lab';
import { toast } from 'react-toastify';
import { UserContext } from 'src/context/UserContext';
import axios from 'axios';
import moment from 'moment';
import TimelineItem from '@material-ui/lab/TimelineItem';
import EditNote from './EditNote';
import Note from './Note';
import NoteForm from './NoteForm';
import CreateEvent from './CreateEvent';
import Event from './Event';
import EditEvent from './EditEvent';

const useStyles = makeStyles((theme) => ({
  timeline: {
    '&::before': {
      flex: 0,
      padding: 0,
    },
  },
  dot: {
    padding: 0,
    borderWidth: 0,
  },
  timeClass: {
    color: theme.palette.primary.main,
    fontSize: 12,
  },
}));

const createTimelineItems = ({ newNotes, newEvents, timelineItems }) => {
  const isEvent = Boolean(newEvents);

  const items = newNotes || newEvents;

  const newItems = timelineItems
    .filter((item) => Boolean(item.eventType) === !isEvent)
    .concat(items)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return newItems;
};

const Timeline = ({ events, notes, patientId }) => {
  const classes = useStyles();
  const [timelineItems, setTimelineItems] = useState([]);
  const [action, setAction] = useState('NOTE');
  const [noteId, setNoteId] = useState(null);
  const [event, setEvent] = useState(null);
  const { user: provider } = useContext(UserContext);

  const handleDeleteItem = async ({ itemId, itemType }) => {
    try {
      const { data: newItems } = await axios.delete(
        `/api/patients/${patientId}/${itemType}s/${itemId}`
      );
      return newItems;
    } catch (error) {
      toast.error(`Error deleting ${itemType}`);
      console.log(error);
    }
  };

  const handleSubmitItem = async ({ item, itemType, resetForm }) => {
    try {
      const payload = {
        providerId: provider.id,
        taggedProviderId: item.taggedProvider?.id,
        ...item,
      };

      delete payload.taggedProvider;

      const { data: newItems } = await axios.post(
        `/api/patients/${patientId}/${itemType}s`,
        payload
      );

      if (resetForm) {
        resetForm();
      }
      return newItems;
    } catch (error) {
      toast.error(`Error creating ${itemType}`);
      console.log(error);
    }
  };

  useEffect(() => {
    const timelineItems = notes
      .concat(events)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setTimelineItems(timelineItems);
  }, [events, notes]);

  return (
    <Card>
      <CardHeader title="Patient Timeline" />
      <Divider />
      <Box p={2} mb={1}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ButtonGroup color="primary" fullWidth>
              <Button
                variant={action === 'NOTE' ? 'outlined' : 'contained'}
                onClick={() => setAction('NOTE')}
              >
                Add Note
              </Button>
              <Button
                variant={action === 'EVENT' ? 'outlined' : 'contained'}
                onClick={() => setAction('EVENT')}
              >
                Add Event
              </Button>
            </ButtonGroup>
          </Grid>

          <Grid item xs={12}>
            {action === 'NOTE' ? (
              <NoteForm
                onSubmit={async (note, resetForm) => {
                  const { body, taggedProviders } = note;
                  const taggedProviderIds = taggedProviders.map((provider) => provider.id);

                  const item = { body, taggedProviderIds };

                  const newNotes = await handleSubmitItem({
                    item: item,
                    itemType: 'note',
                    resetForm,
                  });
                  const newItems = createTimelineItems({
                    newNotes,
                    timelineItems,
                  });
                  setTimelineItems(newItems);
                }}
                buttonText="Save"
              />
            ) : (
              <CreateEvent
                patientId={patientId}
                onSubmit={async (event) => {
                  const newEvents = await handleSubmitItem({
                    item: event,
                    itemType: 'event',
                  });
                  const newItems = createTimelineItems({
                    newEvents,
                    timelineItems,
                  });
                  setTimelineItems(newItems);
                }}
              />
            )}
          </Grid>
        </Grid>

        <MUITimeline>
          {timelineItems.map((item, index) => {
            const isEvent = Boolean(item.eventType);
            return (
              <TimelineItem key={item?.id} className={classes.timeline}>
                <TimelineSeparator>
                  {isEvent ? (
                    <TimelineDot>
                      <StarIcon />
                    </TimelineDot>
                  ) : (
                    <TimelineDot className={classes.dot}>
                      <Avatar src={item.provider.avatarLink} />
                    </TimelineDot>
                  )}

                  {index + 1 < timelineItems.length ? <TimelineConnector /> : null}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography className={classes.timeClass} flex={3} variant="subtitle2">
                    {moment(item.createdAt).format('YYYY-MM-DD hh:mm a')}
                  </Typography>

                  {isEvent ? (
                    <>
                      {event?.id === item.id ? (
                        <EditEvent
                          event={event}
                          patientId={patientId}
                          setEvents={(newEvents) => {
                            const newItems = createTimelineItems({
                              newEvents,
                              timelineItems,
                            });
                            setTimelineItems(newItems);
                            setEvent(null);
                          }}
                        />
                      ) : (
                        <Event
                          event={item}
                          onEdit={(event) => {
                            setEvent(event);
                          }}
                          onDelete={async (id) => {
                            const newEvents = await handleDeleteItem({
                              itemId: id,
                              itemType: 'event',
                            });
                            const newItems = createTimelineItems({
                              newEvents,
                              timelineItems,
                            });
                            setTimelineItems(newItems);
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {noteId === item.id ? (
                        <EditNote
                          {...item}
                          setNoteId={setNoteId}
                          patientId={patientId}
                          noteId={item.id}
                          taggedProviders={item.taggedProviders}
                          setNotes={(newNotes) => {
                            const newItems = createTimelineItems({
                              newNotes,
                              timelineItems,
                            });
                            setTimelineItems(newItems);
                            setNoteId(null);
                          }}
                        />
                      ) : (
                        <Note
                          body={item.body}
                          createdAt={item.createdAt}
                          onEdit={(id) => setNoteId(id)}
                          noteId={item.id}
                          provider={item.provider}
                          taggedProviders={item.taggedProviders}
                          onDelete={async (id) => {
                            const newNotes = await handleDeleteItem({
                              itemId: id,
                              itemType: 'note',
                            });
                            const newItems = createTimelineItems({
                              newNotes,
                              timelineItems,
                            });
                            setTimelineItems(newItems);
                          }}
                        />
                      )}
                    </>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </MUITimeline>
      </Box>
    </Card>
  );
};

export default Timeline;
