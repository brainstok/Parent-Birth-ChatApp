import { useEffect, useState, useContext } from 'react';
import {
  TextField,
  InputAdornment,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  makeStyles,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import _ from 'lodash';
import { KeyboardArrowDown as DropDownIcon, Search as SearchIcon } from '@material-ui/icons';
import DatePicker from 'src/components/common/DatePicker';
import { ChatContext } from 'src/context/ChatContext';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 !important',
    '& .MuiAccordionSummary-root': {
      minHeight: '3rem',
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
    },
  },
  actionButton: {
    height: '3rem',
    width: '100%',
  },
}));

const initialValues = {
  fromDate: null,
  toDate: null,
  keyword: '',
  filterByUserType: '-',
};

const Search = () => {
  const { handleSetMessageQuery, handleSetAccordionHeight } = useContext(ChatContext);
  const [values, setValues] = useState(initialValues);
  const [isValid, setIsValid] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandAccordion = () => {
    setIsExpanded(!isExpanded);

    // Wait for accordion to expand
    setTimeout(() => {
      handleSetAccordionHeight();
    }, 800);
  };

  const classes = useStyles();

  const { root, actionButton } = classes;

  const handleChange = (value) => {
    setValues({ ...values, ...value });
  };

  const handleClear = () => {
    setValues(initialValues);
    handleSetMessageQuery(null);
  };

  const handleSearch = () => {
    const query = { ...values };
    query.fromDate = query.fromDate ? moment(values.fromDate).format('YYYY-MM-DD') : undefined;
    query.toDate = query.toDate ? moment(values.toDate).format('YYYY-MM-DD') : undefined;

    handleSetMessageQuery(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      handleSearch();
    }
    if (e.key === 'Backspace' && !isValid) {
      handleClear();
    }

    if (e.key === 'Backspace' && e.nativeEvent.metaKey && !values.fromDate && !values.toDate) {
      handleClear();
    }
  };

  useEffect(() => {
    setIsValid(_.some(values, (value) => value));
  }, [values]);

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleExpandAccordion}
      className={root}
      id="search-accordion"
    >
      <AccordionSummary expandIcon={<DropDownIcon />}>
        <Typography>Search Messages</Typography>
      </AccordionSummary>
      <AccordionDetails id="search-accordion-details">
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              placeholder="Enter Keyword"
              fullWidth
              value={values.keyword}
              onKeyDown={handleKeyDown}
              onChange={(e) => handleChange({ keyword: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="message-filter">Filter By</InputLabel>
              <Select
                id="message-filter"
                label="Filter By"
                value={values.filterByUserType}
                onChange={(event) => {
                  handleChange({ filterByUserType: event.target.value });
                }}
              >
                <MenuItem value="-">-</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="provider">Provider</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              onChange={(newValue) => handleChange({ fromDate: newValue })}
              label="FROM"
              value={values.fromDate}
            />
          </Grid>
          <Grid xs={12} md={6} item>
            <DatePicker
              onChange={(newValue) => handleChange({ toDate: newValue })}
              label="TO"
              value={values.toDate}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              className={actionButton}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleClear}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              className={actionButton}
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default Search;
