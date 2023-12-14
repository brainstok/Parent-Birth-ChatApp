import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoulaSearch from './DoulaSearch';
import DoulaItem from './DoulaItem';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import LoadingContent from '../common/LoadingContent';
import { Pagination } from '@material-ui/lab';
import asyncDebounce from 'src/utils/asyncDebounce';

const useStyles = makeStyles((theme) => ({
  pagination: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  results: {
    fontSize: '0.8rem',
  },
}));

const handleDoulaSearch = async (query) => {
  try {
    const { data: doulasData } = await axios.get(`/api/doulas`, {
      params: query,
    });
    return doulasData;
  } catch (error) {
    throw error;
  }
};

const debouncedSearch = asyncDebounce(handleDoulaSearch, 500, {
  leading: true,
});

const Doulas = () => {
  const [doulasData, setDoulasData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    city: '',
  });
  const classes = useStyles();

  const doulas = doulasData?.doulas;
  const totalResults = doulasData?.pagination?.total || 0;
  const currentPage = doulasData?.pagination?.page || 1;
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  const handlePageChange = async (event, value) => {
    setQuery({ ...query, page: value });
  };

  const handleSetCity = (city) => {
    setQuery({ page: 1, city });
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const doulasData = await debouncedSearch(query);
        setDoulasData(doulasData);
      } catch (error) {
        setHasError(true);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [query]);

  return (
    <>
      <DoulaSearch city={query.city} handleSetCity={handleSetCity} />
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" color="textPrimary">
            <strong>Results </strong>
            <span className={classes.results}>
              {totalResults === 0
                ? totalResults
                : `${startIndex + 1}-${
                    totalResults < endIndex ? totalResults : endIndex
                  } out of ${totalResults}`}
            </span>
          </Typography>
        </Grid>
      </Grid>

      {isLoading && <LoadingContent />}
      {hasError && (
        <Typography variant="h6" color="error" align="center">
          Error loading doulas
        </Typography>
      )}
      {!isLoading && !hasError && !Boolean(doulas?.length) && (
        <Typography variant="h6" color="textPrimary" align="center">
          No doulas found
        </Typography>
      )}
      {!isLoading && !hasError && Boolean(doulas?.length) && (
        <>
          <Box mb={1}>
            {doulas.map((doula) => (
              <React.Fragment key={doula.id}>
                <DoulaItem doula={doula} />
              </React.Fragment>
            ))}
          </Box>
          <Grid container justifyContent="center">
            <Grid item container xs={12} justifyContent="center">
              <Pagination
                count={Math.ceil(totalResults / 10)}
                page={currentPage || 1}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="round"
                siblingCount={1}
                boundaryCount={1}
                classes={{ ul: classes.pagination }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Doulas;
