import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Checkbox,
  IconButton,
  SvgIcon,
  makeStyles,
  Box,
} from '@material-ui/core';
import { Copy as CopyIcon } from 'react-feather';
import axios from 'axios';
import { toast } from 'react-toastify';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles((theme) => ({
  activeGreen: {
    '&.MuiCheckbox-colorSecondary.Mui-checked': {
      color: theme.palette.success.main,
    },
  },
}));

const Forms = ({ patientForms: initialForms, patientId }) => {
  const [forms, setForms] = useState([]);
  const { activeGreen } = useStyles();

  const handleUpdateForm = async (name, isChecked, formId, patientId) => {
    try {
      const { data: updatedForm } = await axios.put(`/api/patients/${patientId}/forms/${formId}`, {
        [name]: isChecked,
      });
      const idx = forms.findIndex((form) => form.id === updatedForm.id);
      let updatedForms = [...forms];
      updatedForms[idx] = updatedForm;

      setForms(updatedForms);
    } catch (error) {
      toast.error(`Error updating form`);
    }
  };

  const handleCopy = (link, formName) => {
    navigator.clipboard.writeText(link);
    toast.success(`${formName} form was successfully copied to your clipboard`);
  };

  useEffect(() => {
    if (initialForms) {
      setForms(initialForms);
    }
  }, [initialForms]);

  // Sort forms
  if (forms.length) {
    forms.sort((a, b) => a.id - b.id);
  }

  return (
    <Card>
      <CardHeader title="Forms" />
      <Divider />

      <PerfectScrollbar>
        <CardContent>
          <Box minWidth={340}>
            <Grid container>
              {/* need empty grid to show space */}
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <Typography variant="h6" align="center">
                  Sent
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" align="center">
                  Received
                </Typography>
              </Grid>
            </Grid>

            {forms.map((form) => (
              <Grid container key={form.id}>
                <Grid item xs={4} container alignContent="center">
                  <Typography variant="h6" color="primary">
                    {form.label}

                    <IconButton
                      color="primary"
                      size="small"
                      disabled={form.isCompleted}
                      onClick={() => {
                        const link = form.shortLink || form.link;
                        handleCopy(link, form.label);
                      }}
                    >
                      <SvgIcon fontSize="small">
                        <CopyIcon />
                      </SvgIcon>
                    </IconButton>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="center">
                    <Checkbox
                      name="isSent"
                      onChange={(e, isChecked) =>
                        handleUpdateForm(e.target.name, isChecked, form.id, patientId)
                      }
                      color="primary"
                      checked={Boolean(form.isSent)}
                    />
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="h6" align="center">
                    <Checkbox
                      className={activeGreen}
                      name="isCompleted"
                      checked={Boolean(form.isCompleted)}
                    />
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </CardContent>
      </PerfectScrollbar>
    </Card>
  );
};

export default Forms;
