import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';

const CrmButtonSelect = ({
  value: initialValue,
  patientId,
  name,
  isButton,
  className,
  allowNullOption,
  onChange,
  hasError,
  slug,
  renderInputLabel,
  options: initialOptions,
}) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const useStyles = makeStyles((theme) => ({
    autoCompleteClass: {
      '& input': {
        cursor: 'pointer !important',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        display: isButton ? 'none' : 'block',
      },
    },

    greenButtonClass: {
      backgroundColor: 'green',
      color: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        display: isButton ? 'none' : 'block',
      },
      '& .MuiSvgIcon-root': {
        color: 'white',
      },
    },
    redButtonClass: {
      backgroundColor: 'red',
      color: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        display: isButton ? 'none' : 'block',
      },
      '& .MuiSvgIcon-root': {
        color: 'white',
      },
    },
    primaryButtonClass: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '& .MuiButtonBase-root': {
        display: 'none',
      },
    },
    autoCompleteChipClass: {
      marginLeft: 5,
      padding: 0,
      height: theme.spacing(3),
      width: theme.spacing(13),
      fontSize: theme.typography.body2.fontSize,
      // size to be small like a chip
    },
  }));
  const { autoCompleteClass, ...restClasses } = useStyles();

  const handleSave = async (newOption) => {
    const idName = `${name}Id`;
    try {
      await axios.put(`/api/patients/${patientId}`, {
        [idName]: newOption.id,
      });
      setValue(newOption);
    } catch (error) {
      toast.error(`Error updating ${name}`);
    }
  };

  const getCrmOptions = async (slug) => {
    try {
      const { data: options } = await axios.get(`/api/crm/options/${slug}`);
      return options;
    } catch (error) {
      toast.error(`Error getting options for ${name}`);
      return [];
    }
  };

  useEffect(() => {
    if (initialOptions) {
      setOptions(initialOptions);
      return;
    }

    (async () => {
      const crmOptions = await getCrmOptions(slug);

      if (allowNullOption) {
        crmOptions.push({ id: null, label: '-' });
      }
      setOptions([...crmOptions]);
    })();
  }, []);

  useEffect(() => {
    let value = initialValue;
    if (!initialValue?.id && !initialValue?.label) {
      value = { id: null, label: '-' };
    }
    setValue(value);
  }, [initialValue]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      className={autoCompleteClass}
      disableClearable
      getOptionSelected={(option, value) =>
        option.label === value.label || { id: null, label: '-' }
      }
      getOptionLabel={(option) => option.label}
      options={options}
      onChange={(event, newValues) => {
        if (Boolean(onChange)) {
          onChange(newValues);
        } else {
          handleSave(newValues);
        }
      }}
      renderInput={(params) => (
        <TextField
          label={renderInputLabel ? renderInputLabel : ''}
          error={hasError}
          fullWidth
          {...params}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            className: restClasses[className],
            readOnly: true,
          }}
        />
      )}
    />
  );
};

CrmButtonSelect.propTypes = {
  initialValue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  patientId: PropTypes.string.isRequired,
  isButton: PropTypes.bool,
  classes: PropTypes.arrayOf(PropTypes.string.isRequired),
  className: PropTypes.string,
  allowNullOption: PropTypes.bool,
};

export default CrmButtonSelect;
