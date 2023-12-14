import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import PhoneInput from 'react-phone-number-input';

const input = forwardRef((props, ref) => {
  return <TextField {...props} inputRef={ref} />;
});

const PhoneField = ({ value, onChange, ...args }) => {
  return (
    <PhoneInput
      value={value}
      inputComponent={input}
      country="US"
      defaultCountry="US"
      onChange={onChange}
      {...args}
    />
  );
};

PhoneField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  args: PropTypes.shape({
    fullWidth: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    error: PropTypes.bool.isRequired,
  }),
};

export default PhoneField;
