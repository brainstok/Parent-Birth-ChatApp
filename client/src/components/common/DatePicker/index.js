import { makeStyles, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  datePicker: {
    marginTop: 0,
    marginBottom: 0,
    '& input': {
      fontSize: 14,
      padding: 10,
      height: 40,
    },
    '& button': {
      padding: 0,
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 5,
    },
    '& .MuiInputAdornment-root': {
      marginLeft: 0,
    },
    '& .MuiFormHelperText-root': {
      display: 'none',
    },
  },
}));

const DatePicker = ({ onChange, value, label, ...rest }) => {
  const classes = useStyles();

  return (
    <KeyboardDatePicker
      margin="normal"
      label={label || 'MM/DD/YYYY'}
      format="MM/dd/yyyy"
      value={value}
      onChange={onChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      TextFieldComponent={(props) => (
        <TextField {...props} variant="outlined" style={{ width: '100%' }} />
      )}
      className={classes.datePicker}
      {...rest}
    />
  );
};

export default DatePicker;
