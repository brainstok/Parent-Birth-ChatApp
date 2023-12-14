import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ListItem,
  makeStyles,
  Box,
  Typography,
  IconButton,
  Tooltip,
  SvgIcon,
} from '@material-ui/core';
import { Copy as CopyIcon } from 'react-feather';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import { formatPhoneNumber } from 'react-phone-number-input';
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
  message: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },

  listItem: {
    position: 'relative',
    borderBottom: `1px solid ${theme.palette.background.dark}`,
    cursor: 'pointer',
  },
  iconButton: {
    width: 40,
    height: 40,
  },
  selected: {
    backgroundColor: theme.palette.grey[100],
  }
}));

const SearchItem = ({ message }) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    selectedMessageId,
    handleSelectSearchMessage,
  } = useContext(ChatContext);

  const { createdByProvider, createdByPatient, fromPhoneNumber, id } = message;

  let name = formatPhoneNumber(fromPhoneNumber);

  if (createdByProvider) {
    name = `${createdByProvider.firstName} ${createdByProvider.lastName}`;
  }

  if (createdByPatient) {
    name = createdByPatient.displayName;
  }

  const eliminateHtmlTags = (content) => content.replace(/(<([^>]+)>)/gi, '');

  const handleCopy = async () => {
    if (message.body) {
      try {
        const copiedText = eliminateHtmlTags(message.body);
        await navigator.clipboard.writeText(copiedText);
        toast.success('Message has been copied to your clipboard!', {
          theme: 'colored',
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClick = () => {
    const phoneNumber = message.fromPhoneNumber || message.toPhoneNumber;
    handleSelectSearchMessage({ messageId: id, phoneNumber });
    const encodedPhoneNumber = encodeURIComponent(phoneNumber);
    history.push(`/chat?phoneNumber=${encodedPhoneNumber}`);
  };

  return (
    <ListItem className={clsx(classes.listItem, selectedMessageId === id && classes.selected)} onClick={handleClick}>
      <Box width="100%" minHeight={40}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <Typography className={classes.text}>{name}</Typography>
          </Box>

          <Typography className={classes.time}>{moment(message.createdAt).format('L')}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <ReactMarkdown id={`${message.id}-body`} className={classes.message} allowDangerousHtml>
            {message.body}
          </ReactMarkdown>
          <Box display="flex" alignItems="center">
            <Tooltip title="Copy">
              <span>
                <IconButton color="primary" onClick={handleCopy} className={classes.iconButton}>
                  <SvgIcon fontSize="small">
                    <CopyIcon />
                  </SvgIcon>
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
};

SearchItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default SearchItem;
