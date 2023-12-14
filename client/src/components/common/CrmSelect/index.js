import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Box,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import CrmChip from 'src/components/common/CrmChip';
import Tooltip from 'src/components/common/ToolTip';
import { PlusCircle as AddIcon } from 'react-feather';
import { Formik } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  textFieldClass: {
    '& label': {
      whiteSpace: 'nowrap',
      fontSize: '14px',
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
  iconClass: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginTop: 17,
  },
}));

const validationSchema = Yup.object().shape({
  option: Yup.string().required('Write an update...'),
});

const CrmSelect = ({
  onChange,
  selectedOptions,
  label,
  apiSlug,

  hasError,
  allowAdding,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [currentSelectedOptions, setCurrentSelectedOptions] = useState([]);
  const [optionModalLabel, setOptionModalLabel] = useState(null);
  const { inputClass, iconClass, textFieldClass } = useStyles();
  const selectRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddNewOptionModal = (optionLabel) => {
    setOptionModalLabel(optionLabel);
  };

  const handleSaveNewOption = async (values) => {
    try {
      await axios.post(`/api/crm/options/${apiSlug}`, values);
      setOptionModalLabel(null);
    } catch (error) {
      toast.error(`Error creating new option for ${apiSlug}`);
      throw error;
    }
  };

  const getCrmOptions = async (apiSlug) => {
    try {
      const { data: options } = await axios.get(`/api/crm/options/${apiSlug}`);
      return options;
    } catch (error) {
      toast.error(`Error getting options for ${apiSlug}`);
      throw error;
    }
  };

  const handleChange = async ({ options, reason }) => {
    console.log('handle internal change');
  };

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      (async () => {
        const crmOptions = await getCrmOptions(apiSlug);
        setOptions([...crmOptions]);
        setIsLoading(false);
      })();
    }
  }, [open]);

  useEffect(() => {
    if (selectedOptions) {
      setCurrentSelectedOptions(selectedOptions);
    }
  }, [selectedOptions]);

  return (
    <>
      <Autocomplete
        ref={selectRef}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        disableClearable
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => option.label}
        options={options}
        loading={isLoading}
        value={currentSelectedOptions}
        onChange={(event, options, reason) => {
          if (Boolean(onChange)) {
            onChange(options);
          } else {
            handleChange({ options, reason });
          }
        }}
        filterSelectedOptions
        multiple
        renderTags={(tagValues, getTagProps) => {
          return tagValues.map((option, index) => (
            <CrmChip
              key={option?.id}
              selectLabel={label}
              label={option.label}
              {...getTagProps({ index })}
            />
          ));
        }}
        renderInput={(params) => (
          <Box display="flex" alignItems="center">
            <TextField
              {...params}
              error={hasError}
              label={label}
              variant="standard"
              className={textFieldClass}
              InputProps={{
                ...params.InputProps,
                className: inputClass,
                endAdornment: <>{params.InputProps.endAdornment}</>,
              }}
            />
            {allowAdding && (
              <Tooltip arrow title={'Add an option'} placement="top-start">
                <AddIcon
                  size={16}
                  className={iconClass}
                  onClick={() => handleOpenAddNewOptionModal(label)}
                />
              </Tooltip>
            )}
          </Box>
        )}
      />
      <Dialog
        open={Boolean(optionModalLabel)}
        onClose={() => setOptionModalLabel(null)}
        transitionDuration={0}
      >
        <DialogContent>
          <Box minWidth={300} paddingTop={1} paddingBottom={2}>
            <Formik
              validationSchema={validationSchema}
              enableReinitialize
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleSaveNewOption}
              initialValues={{ option: '' }}
            >
              {({ errors, handleChange, handleSubmit }) => {
                return (
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12}>
                        <Typography variant="h5">Add option to {optionModalLabel}</Typography>
                      </Grid>

                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          error={Boolean(errors.option)}
                          name="option"
                          onChange={handleChange}
                          placeholder="Enter new option"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button variant="contained" color="primary" type="submit">
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

CrmSelect.propTypes = {
  selectedOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  apiSlug: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
};

export default CrmSelect;
