import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { Avatar, Box, Typography, makeStyles, Link } from '@material-ui/core';
import { Face as FaceIcon } from '@material-ui/icons';
import Linkifyjs from 'linkifyjs/react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
    display: 'flex',
  },
  avatar: {
    height: 32,
    width: 32,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  botAvatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  image: {
    cursor: 'pointer',
    height: 'auto',
    maxWidth: '100%',
    width: 380,
  },
  selected: {
    backgroundColor: theme.palette.grey[200],
  },
  body: {
    '& a': {
      color: 'white',
    },
  },
}));

const MessageItem = React.forwardRef(({ className, message, isSelected, ...rest }, ref) => {
  const classes = useStyles();

  const { createdByPatient, createdByProvider } = message || {};
  const createdBy = createdByPatient || createdByProvider || {};

  let createdByName = '';
  if (createdByPatient) {
    createdByName = createdByPatient.displayName;
  }

  if (createdByProvider) {
    createdByName = `${createdByProvider.firstName} ${createdByProvider.lastName || ''}`;
  }
  const isProvider = !!createdByProvider;

  return (
    <div className={clsx({[classes.selected]: isSelected}, classes.root, className)} ref={ref} {...rest}>
      <Box display="flex" maxWidth={500} ml={isProvider ? 'auto' : 0}>
        {isProvider ? (
          <Avatar src={createdBy.avatarLink} className={clsx(classes.avatar, classes.botAvatar)}>
            <FaceIcon color="primary" />
          </Avatar>
        ) : (
          <Avatar className={classes.avatar} src={createdBy.avatar} />
        )}

        <Box ml={2}>
          <Box
            bgcolor={isProvider ? 'ternary.main' : 'secondary.main'}
            borderRadius="borderRadius"
            boxShadow={1}
            color={isProvider ? 'primary.contrastText' : 'text.primary'}
            px={2}
            py={1}
            style={{
              wordBreak: 'break-word',
            }}
          >
            {isProvider ? (
              <Typography variant="h6">{createdByName || 'N/A'}</Typography>
            ) : (
              <Link
                variant="body1"
                color="textPrimary"
                component={RouterLink}
                to={`/patients/${createdBy.id}`}
              >
                {createdByName || 'N/A'}
              </Link>
            )}

            <Box mt={1}>
              <Typography className={classes.body} color="inherit" variant="body1">
                <Linkifyjs>{message.body}</Linkifyjs>
              </Typography>
            </Box>
          </Box>
          <Box mt={1} display="flex" justifyContent="flex-end">
            <Typography noWrap color="textSecondary" variant="caption">
              {moment(message.createdAt).format('l, h:mm:ss a')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
});

MessageItem.propTypes = {
  className: PropTypes.string,
  message: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
};

export default MessageItem;
