import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Avatar, TextField, Chip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { toast } from 'react-toastify';
import _ from 'lodash';
import getProviders from 'src/utils/getProviders';

const ProviderMultiSelect = ({ providers: initialProviders, handleChange, className, label }) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState([]);

  const handleProviderChange = (newValue) => {
    handleChange(newValue);
    setProviders(newValue);
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
    setProviders(initialProviders);
    return;
  }, [initialProviders]);

  return (
    <Autocomplete
      multiple
      className={className}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      filterSelectedOptions
      disableClearable
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option?.name}
      options={options}
      value={providers}
      onChange={(event, newValue) => {
        handleProviderChange(newValue);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            avatar={<Avatar src={option?.avatarLink} />}
            color="secondary"
            size="small"
            label={option.name}
            {...getTagProps({ index })}
          />
        ))
      }
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
            variant="outlined"
            {...params}
            InputProps={{
              ...params.InputProps,
            }}
          />
        );
      }}
    />
  );
};

ProviderMultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  initialProviders: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.object,
};

export default ProviderMultiSelect;
