import { useState, useEffect } from 'react';
import { makeStyles, TextField, Button, Box } from '@material-ui/core';
import { toast } from 'react-toastify';
// import Loader from "src/components/common/Loader";
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  saveButton: {
    '& 	.MuiButton-label': {
      textTransform: 'capitalize',
      fontWeight: 'bold',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

const getMessages = async () => {
  try {
    const { data: messages } = await axios.get(`/api/settings/automated-messages`);
    return messages || [];
  } catch (error) {
    console.log(error);
    toast.error(`Error getting pre-set messages`);
  }
};

const handleSubmitSavedMessage = async (messageId, body) => {
  try {
    await axios.put(`/api/settings/automated-messages/${messageId}`, {
      body,
    });
  } catch (error) {
    console.log(error);
    toast.error(`Error updating message`);
    return error;
  }
};

function MessagesForm() {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);

  const handleSaveMessage = async (message, index) => {
    const messageId = message.id;
    const body = message.body;

    try {
      await handleSubmitSavedMessage(messageId, body);

      toast.success(`🙌 ${message.label} Saved!`);
    } catch (error) {
      console.log(error);
      toast.error('There was an error saving your message. Please try again');
    } finally {
    }
  };

  useEffect(() => {
    (async () => {
      const messages = await getMessages();
      setMessages(messages);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box>
        {messages.map((message, index) => (
          <Formik
            key={message.id}
            initialValues={message}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize
            onSubmit={(value) => handleSaveMessage(value, index)}
            validationSchema={Yup.object().shape({
              body: Yup.string().required('Required'),
            })}
          >
            {({ values, errors, handleSubmit, setFieldValue, setFieldError, isValid }) => {
              return (
                <form onSubmit={handleSubmit} className={classes.form}>
                  <TextField
                    error={errors.message}
                    fullWidth
                    name="message"
                    variant="outlined"
                    value={values.body}
                    multiline
                    minRows={5}
                    label={message.label}
                    onChange={(e) => {
                      setFieldValue('body', e.target.value);
                      setFieldError('body', undefined);
                    }}
                  />
                  <Button
                    className={classes.saveButton}
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    disabled={!isValid}
                  >
                    Save
                  </Button>
                </form>
              );
            }}
          </Formik>
        ))}
      </Box>
    </>
  );
}

export default MessagesForm;
