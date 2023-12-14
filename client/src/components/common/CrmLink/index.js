import {
  Checkbox,
  Grid,
  FormControlLabel,
  makeStyles,
  IconButton,
  SvgIcon,
  Link,
} from '@material-ui/core';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Copy as CopyIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
  textFieldClass: {
    '& .MuiInput-input': {
      '&:after': {},
    },
  },
  inputClass: {
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
  labelClass: {
    '& .MuiCheckbox-root': {
      padding: 5,
    },
    '& span': {
      fontSize: 14,
    },
  },
  link: {
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const CrmLink = ({
  value,
  isSent: initalIsSent,
  isCompleted: initialIsCompleted,
  patientId,
  patientFormId,
}) => {
  const classes = useStyles();

  const { labelClass } = useStyles();
  const [isSent, setIsSent] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleUpdateForm = async ({ patientId, isSent, isCompleted, patientFormId }) => {
    try {
      const { data } = await axios.put(`/api/patients/${patientId}/forms/${patientFormId}`, {
        isSent,
        isCompleted,
      });
      return data;
    } catch (error) {
      throw error.message;
    }
  };

  const handleSelectIsSent = async (event) => {
    try {
      const { isSent } = await handleUpdateForm({
        isSent: event.target.checked,
        isCompleted,
        patientId,
        patientFormId,
      });
      setIsSent(isSent);
    } catch (error) {
      toast.error(`Error updating sent`);
      throw error;
    }
  };

  const handleSelectIsCompleted = async (event) => {
    try {
      const { isCompleted } = await handleUpdateForm({
        isCompleted: event.target.checked,
        isSent,
        patientId,
        patientFormId,
      });
      setIsCompleted(isCompleted);
    } catch (error) {
      toast.error(`Error updating received`);
      throw error;
    }
  };

  useEffect(() => {
    setIsSent(initalIsSent);
    setIsCompleted(initialIsCompleted);
  }, [initalIsSent, initialIsCompleted]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid container item xs={8} alignItems="center" justifyContent="center">
        <Link className={classes.link} href={value} target="_blank" rel="noreferrer">
          {value}
        </Link>
        <IconButton onClick={handleCopy} className={classes.iconButton}>
          <SvgIcon>
            <CopyIcon />
          </SvgIcon>
        </IconButton>
      </Grid>
      <Grid item container xs={4}>
        <Grid item>
          <FormControlLabel
            onChange={handleSelectIsSent}
            className={labelClass}
            control={<Checkbox name="isSent" checked={isSent} color="primary" />}
            label="Sent"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            onChange={handleSelectIsCompleted}
            className={labelClass}
            control={<Checkbox name="isCompleted" checked={isCompleted} color="primary" />}
            label="Completed"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CrmLink;
