import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Avatar, TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { toast } from 'react-toastify';
import _ from 'lodash';
import getProviders from 'src/utils/getProviders';

const ProviderSelect = ({ provider: initialProvider, handleChange, label }) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState({});

  const handleProviderChange = (newValue) => {
    handleChange(newValue);
    setProvider(newValue);
  };

  useEffect(() => {
    (async () => {
      if (open && !options.length) {
        try {
          const providerOptions = await getProviders();
          setOptions(providerOptions);
        } catch (error) {
          toast.error(`Error getting provider`);
          console.log('error getting provider =>', error.message);
        }
      }
    })();
  }, [open]);

  useEffect(() => {
    if (initialProvider && !_.isEqual(initialProvider, provider)) {
      setProvider(initialProvider);
    }
  }, [initialProvider]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disableClearable
      getOptionSelected={(option, value) => option?.name === value?.name || { name: ' ' }}
      value={provider}
      getOptionLabel={(option) => option?.name || ''}
      options={options}
      onChange={(event, newValue) => {
        handleProviderChange(newValue);
      }}
      renderOption={(option) => (
        <Box display="flex" alignItems="center">
          <Box mr={1}>
            <Avatar src={option?.avatarLink} />
          </Box>

          {option?.name}
        </Box>
      )}
      renderInput={(params) => {
        return (
          <TextField
            fullWidth
            label={label}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar src={provider?.avatarLink} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        );
      }}
    />
  );
};

ProviderSelect.propTypes = {
  label: PropTypes.string.isRequired,
  initialProvider: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.object,
};

export default ProviderSelect;
