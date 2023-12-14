import { useState, useContext } from 'react';
import {
  makeStyles,
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from '@material-ui/core';
import Page from 'src/components/common/Page';
import PhoneField from 'src/components/common/PhoneField';
import ConfirmationModal from 'src/components/Chat/ConfirmationModal';
import { toast } from 'react-toastify';
import { UserContext } from 'src/context/UserContext';
import axios from 'axios';
import useDevice from 'src/utils/useDevice';
import Loader from 'src/components/common/Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
}));

const MassText = () => {
  const classes = useStyles();
  const { isMobile } = useDevice();
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    e.persist();
    setMessage(e.target.value);
  };

  const handleSetConfirmationModal = (isOpenClose) => {
    setIsModalOpen(isOpenClose);
  };

  const handleSendMassMessage = async (message) => {
    try {
      setIsLoading(true);
      await axios.post('/api/messages/mass', {
        body: message,
      });
      setIsModalOpen(false);
      toast.success('Mass Text Sent!');
      setMessage('');
    } catch (error) {
      toast.error(`Error sending mass text`);
      console.log('Error sending mass text message =>', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMessage = async (message, phoneNumber) => {
    try {
      setIsLoading(true);
      await axios.post('/api/messages/mass/test', {
        body: message,
        phoneNumber,
        auth0Id: user.auth0Id,
      });
      setTestPhoneNumber('');
      toast.success(`Test Message sent!`);
    } catch (error) {
      setHasError(true);
      toast.error(`Error sending test message`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page className={classes.root} title="Mass Text" ref={null}>
      <Container disableGutters={isMobile && true} maxWidth="sm">
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item>
                <Typography variant="h4">Send Mass Text</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={message}
                  multiline
                  minRows="3"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Message to be sent to all patients"
                />
              </Grid>
              <Grid container item justifyContent="space-between">
                <Grid item xs={8}>
                  <PhoneField
                    value={testPhoneNumber || ''}
                    onChange={(value) => setTestPhoneNumber(value)}
                    fullWidth
                    variant="outlined"
                    name="test phone number"
                    placeholder="Enter Test Phone Number"
                    label=""
                    error={hasError}
                  />
                </Grid>
                <Button
                  disabled={!message || !testPhoneNumber}
                  color="primary"
                  variant="contained"
                  onClick={() => handleTestMessage(message, testPhoneNumber)}
                >
                  Test
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={!message.length}
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={() => setIsModalOpen(!isModalOpen)}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {isLoading && (
          <Box marginTop={3}>
            <Grid container justifyContent="center">
              <Loader />
            </Grid>
          </Box>
        )}
      </Container>
      <ConfirmationModal
        isModalOpen={isModalOpen}
        handleSendMessageConfirmation={() => handleSendMassMessage(message)}
        handleSetConfirmationModal={handleSetConfirmationModal}
      />
    </Page>
  );
};

export default MassText;
