import { useState, useCallback, useEffect } from 'react';

import { TextField, InputAdornment, Grid, Button, makeStyles } from '@material-ui/core';
import { HighlightOff as CloseIcon, Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  closeIconClass: {
    cursor: 'pointer',
  },
}));

const DoulaSearch = ({ city, handleSetCity }) => {
  const { closeIconClass } = useStyles();

  return (
    <>
      <Grid container justifyContent="space-between" spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            value={city}
            variant="outlined"
            type="text"
            placeholder="Search by City"
            onChange={(e) => handleSetCity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {city.length > 0 && (
                    <CloseIcon
                      className={closeIconClass}
                      onClick={() => handleSetCity('')}
                      hidden={city.length <= 0}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DoulaSearch;
