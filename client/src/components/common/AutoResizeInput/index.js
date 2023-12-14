import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';
import { makeStyles, Paper, FormHelperText, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  inputClass: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontFamily: 'Wigrum, sarif',
    lineHeight: '120%',
    fontSize: 16,
    resize: 'none',
    '&::placeholder': {
      color: 'lightgrey',
    },
    paddingTop: 10,
    paddingLeft: 3,
    paddingRight: 3,
    minHeight: 50,
  },
}));

const AutoResizeInput = (props) => {
  const { inputClass } = useStyles();

  return (
    <Box>
      <Paper variant="outlined">
        <TextareaAutosize {...props} className={`${inputClass} ${props.className}`} />
      </Paper>
      {props.errortext && <FormHelperText error>{props.errortext}</FormHelperText>}
    </Box>
  );
};

AutoResizeInput.propTypes = {
  props: PropTypes.shape({
    name: PropTypes.string,
    errortext: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    variant: PropTypes.string,
    placeholder: PropTypes.func.isRequired,
    className: PropTypes.func.isRequired,
  }),
};

export default AutoResizeInput;
