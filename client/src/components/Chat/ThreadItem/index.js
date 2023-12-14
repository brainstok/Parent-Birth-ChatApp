import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ListItem, makeStyles, Box, Typography, Chip } from '@material-ui/core';
import useDevice from 'src/utils/useDevice';
import {
  FiberManualRecord as AlertIcon,
  Person as PersonIcon,
  WbSunny as Sun,
} from '@material-ui/icons';
import moment from 'moment';
import { ChatContext } from 'src/context/ChatContext';

const useStyles = makeStyles((theme) => ({
  text: {
    color: theme.palette.ternary.main,
    fontSize: 14,
    marginRight: 3,
  },
  time: {
    color: theme.palette.text.secondary,
    fontSize: 12,
  },
  lastMessage: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  },
  active: {
    backgroundColor: theme.palette.action.selected,
    boxShadow: `inset 4px 0px 0px ${theme.palette.ternary.main}`,
  },
  smallAvatar: {
    height: 30,
    width: 30,
    '&:first-child': {
      marginTop: 10,
    },
  },
  unreadIndicator: {
    color: theme.palette.error.main,
    fontSize: 16,
  },
  listItem: {
    position: 'relative',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.background.dark}`,
  },
  iconContainer: {
    position: 'absolute',
    right: 18,
    bottom: 5,
  },
  profile: {
    fontSize: 16,
    color: theme.palette.text.secondary,
  },
  needsReply: {
    fontSize: 16,
    color: theme.palette.error.dark,
    marginRight: 8,
  },
  starSelected: {},
  chip: {
    fontSize: 10,
    height: 20,
    paddingTop: 2,
    marginLeft: 5,
    color: 'white',
    background: theme.palette.error.main,
  },
  draftChip: {
    height: 20,
    fontSize: 10,
    paddingTop: 2,
    marginLeft: 2,
    background: theme.palette.ternary.main,
    fontWeight: 500,
    color: 'white',
  },
}));

const ThreadItem = ({ active, thread }) => {
  const classes = useStyles();
  const history = useHistory();
  const { handleSelectThread, previousPhoneNumber } = useContext(ChatContext);
  const { isDesktop } = useDevice();

  if (!thread) {
    return null;
  }

  const handleProfileClick = (thread) => {
    history.push(`/patients/${thread.id}`);
  };

  const handleClick = (thread) => {
    if (isDesktop && previousPhoneNumber === thread.phoneNumber) return;

    handleSelectThread(thread);
    const encodedPhoneNumber = encodeURIComponent(thread.phoneNumber);
    history.push(`/chat?phoneNumber=${encodedPhoneNumber}`);
  };

  return (
    <ListItem className={clsx({ [classes.active]: active }, classes.listItem)}>
      <Box className={classes.iconContainer}>
        {!thread?.hasReceivedProviderMessage && <Sun className={classes.needsReply} />}
        <PersonIcon className={classes.profile} onClick={() => handleProfileClick(thread)} />
      </Box>

      <Box width="100%" minHeight={40} onClick={() => handleClick(thread)}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <Typography className={classes.text}>{thread.displayName}</Typography>
            {thread.hasUnreadPatientMessageIds && <AlertIcon className={classes.unreadIndicator} />}
            {thread.status !== 'Active' && (
              <Chip className={classes.chip} size="small" label="INACTIVE" />
            )}

            {thread?.draft && <Chip className={classes.draftChip} size="small" label="DRAFT" />}
          </Box>

          {thread.lastMessage && (
            <Typography className={classes.time}>
              {moment(thread.lastMessage.createdAt).format('L')}
            </Typography>
          )}
        </Box>

        {thread.lastMessage && (
          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.lastMessage}>{thread.lastMessage.body}</Typography>
            <Box ml={2} display="flex" flexDirection="column" alignItems="flex-end"></Box>
          </Box>
        )}
      </Box>
    </ListItem>
  );
};

ThreadItem.propTypes = {
  active: PropTypes.bool,
  thread: PropTypes.object.isRequired,
};

export default ThreadItem;
