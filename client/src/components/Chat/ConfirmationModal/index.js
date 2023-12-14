import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  modalCloseButton: {
    position: 'absolute',
    right: 10,
    top: 2,
  },
  modalSendButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  modalCancelButton: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const ConfirmationModal = ({
  isConfirmationModalOpen,
  handleSetConfirmationModal,
  handleSendMessageConfirmation,
}) => {
  const classes = useStyles();

  return (
    <Dialog open={isConfirmationModalOpen} onClose={() => handleSetConfirmationModal(false)}>
      <DialogTitle>
        {' '}
        <IconButton
          aria-label="close"
          className={classes.modalCloseButton}
          onClick={() => handleSetConfirmationModal(false)}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you would like to send this message?
        </DialogContentText>
        <DialogActions>
          <Button
            aria-label="cancel"
            onClick={() => handleSetConfirmationModal(false)}
            className={classes.modalCancelButton}
          >
            Cancel
          </Button>
          <Button
            aria-label="send message confirmation"
            className={classes.modalSendButton}
            autoFocus
            onClick={handleSendMessageConfirmation}
          >
            Send
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  isConfirmationModalOpen: PropTypes.bool,
  handleSetConfirmationModal: PropTypes.func,
  handleSendMessageConfirmation: PropTypes.func,
};

ConfirmationModal.defaultProps = {};

export default ConfirmationModal;
