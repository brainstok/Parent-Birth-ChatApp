import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  IconButton,
  Paper,
  SvgIcon,
  Tooltip,
  makeStyles,
  Typography,
  Box,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { Send as SendIcon, Save as SaveIcon, Zap as ZapIcon } from 'react-feather';
import LoadingContent from '../../common/LoadingContent';
import TextareaAutosize from 'react-textarea-autosize';
import ConfirmationModal from '../ConfirmationModal';
import { ChatContext } from 'src/context/ChatContext';

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'flex-start',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    padding: theme.spacing(1, 2),
    justifyContent: 'space-between',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  inputContainer: {
    marginLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
  },
  divider: {
    height: 24,
    width: 1,
  },
  fileInput: {
    display: 'none',
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontFamily: 'Wigrum, sarif',
    lineHeight: '120%',
    fontSize: 16,
    resize: 'none',
    '&::placeholder': {
      color: 'lightgrey',
    },
  },
  character: {
    alignSelf: 'flex-end',
  },
  iconButton: {
    marginTop: 5,
  },
  loading: {
    height: 'auto',
  },
}));

const saveDraft = async ({ patientId, message }) => {
  try {
    await axios.post(`/api/patients/${patientId}/drafts`, {
      body: message,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteDraft = async ({ patientId }) => {
  try {
    await axios.delete(`/api/patients/${patientId}/drafts`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAiResponse = async ({ patientId }) => {
  try {
    const { data } = await axios.get('/api/messages/ai', {
      params: {
        patientId,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const MessageComposer = () => {
  const classes = useStyles();

  const { recipient, handleSendMessage, selectedPhoneNumber } = useContext(ChatContext);
  const { displayName, id: patientId, draft, lastMessage } = recipient || {};
  const [message, setMessage] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    event.persist();
    setMessage(event.target.value);

    if (event.target.value === '' && draft) {
      handleDeleteDraft(patientId);
    }
  };

  const handleDeleteDraft = async () => {
    try {
      await deleteDraft({ patientId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDraft = async () => {
    if (message === '') return;
    const patientId = recipient?.id;
    try {
      await saveDraft({ patientId, message });
      toast.success('Your draft has been saved successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Unable to save message at this time');
    }
  };

  const handleAiResponse = async () => {
    try {
      setIsLoading(true);
      const response = await getAiResponse({ patientId });
      setMessage(response);
    } catch (error) {
      console.log(error);
      toast.error('Unable to get AI response at this time');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      if (message === '') return;
      handleSetConfirmationModal(true);
      event.preventDefault();
    }
  };

  const handleSend = () => {
    try {
      if (!!message.trim()) {
        if (message.length > 1600) {
          throw new Error('Message exceeds the 1600 character limit');
        }
        handleSetConfirmationModal(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSetConfirmationModal = (isOpen) => {
    setIsConfirmationModalOpen(isOpen);
  };

  const handleSendMessageConfirmation = () => {
    handleSetConfirmationModal(false);
    if (!!message.trim()) {
      setMessage('');
      handleSendMessage({ body: message, phoneNumber: selectedPhoneNumber });
    }
  };

  useEffect(() => {
    (async () => {
      // Set draft if recipient has one
      if (draft) {
        setMessage(draft);
      }
    })();

    return () => {
      // Clear message on unmount
      setMessage('');
    };
  }, [recipient]);

  if (!selectedPhoneNumber) return null;

  return (
    <Box className={classes.container}>
      <Box className={classes.messageContainer}>
        <Paper variant="outlined" className={classes.inputContainer}>
          <TextareaAutosize
            className={classes.input}
            value={message || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${displayName || ''}`}
          />
          {isLoading && <LoadingContent loaderSize={25} additionalStyle={classes.loading} />}
        </Paper>
        <Typography className={classes.character}>
          {`${message?.length || 0} characters`}
        </Typography>
      </Box>
      <Box display="flex">
        <Tooltip title={lastMessage && !isLoading ? 'AI' : ''}>
          <IconButton
            color="primary"
            disabled={!lastMessage || isLoading}
            onClick={handleAiResponse}
            className={classes.iconButton}
          >
            <SvgIcon fontSize="small">
              <ZapIcon />
            </SvgIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title={message ? 'Save' : ''}>
          <IconButton
            color="primary"
            disabled={!message}
            onClick={handleSaveDraft}
            className={classes.iconButton}
          >
            <SvgIcon fontSize="small">
              <SaveIcon />
            </SvgIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title={message ? 'Send' : ''}>
          <IconButton
            color="primary"
            disabled={!message}
            onClick={handleSend}
            className={classes.iconButton}
          >
            <SvgIcon fontSize="small">
              <SendIcon />
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </Box>
      <ConfirmationModal
        isConfirmationModalOpen={isConfirmationModalOpen}
        handleSetConfirmationModal={handleSetConfirmationModal}
        handleSendMessageConfirmation={handleSendMessageConfirmation}
      />
    </Box>
  );
};

MessageComposer.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

MessageComposer.defaultProps = {};

export default MessageComposer;
