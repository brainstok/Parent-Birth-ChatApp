import React, { useContext } from 'react';
import { ResourceContext } from 'src/context/ResourceContext';
import useDevice from 'src/utils/useDevice';
import {
  makeStyles,
  Card,
  Container,
  Grid,
  Typography,
  Divider,
  CircularProgress,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import Page from 'src/components/common/Page';
import ResourcesSearch from 'src/components/Resources/ResourcesSearch';
import ResourceResult from 'src/components/Resources/ResourcesResult';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  totalResults: {
    color: theme.palette.text.secondary,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

const getResources = async (values) => {
  try {
    const config = {
      params: values,
    };

    const { data: resources } = await axios.get('/api/resources', config);
    return resources;
  } catch (error) {
    toast.error(`error getting resources`);
  }
};

const ResourceLibrary = () => {
  const { isMobile } = useDevice();
  const {
    resources,
    setResources,
    hasNoResources,
    setHasNoResources,
    isLoading,
    setIsLoading,
    setHasError,
    hasError,
    topic,
    subtopics,
    searchText,
  } = useContext(ResourceContext);
  const classes = useStyles();

  const handleSearchResources = async () => {
    try {
      setIsLoading(true);
      setResources([]);

      const subtopicIds = subtopics.map((subtopic) => subtopic.id);
      const values = {
        topicId: topic?.id,
        subtopicIds,
        keyword: searchText || undefined,
      };

      const newResources = await getResources(values);

      if (newResources.length) {
        setHasNoResources(false);
        setResources(newResources);
      } else {
        setHasNoResources(true);
      }
    } catch (error) {
      setHasError(true);
      toast.error(`Error searching resources`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page className={classes.root} title="ResourceLibrary">
      <Container disableGutters={isMobile && true} maxWidth="md">
        <Card>
          <CardHeader title="Resource Library" titleTypographyProps={{ variant: 'h4' }} />
          <Divider />
          <CardContent className={classes.cardContent}>
            <ResourcesSearch handleSearchResources={handleSearchResources} />
            {!isLoading && resources?.length ? (
              <>
                <Typography variant="h5">
                  Results <span className={classes.totalResults}>({resources?.length})</span>
                </Typography>
                {resources?.map((resource, index) => (
                  <ResourceResult
                    hasDivider={resources.length > index + 1}
                    key={resource.id}
                    resource={resource}
                  />
                ))}
              </>
            ) : null}
            {!isLoading && hasNoResources ? (
              <>
                <Typography variant="h5">
                  Results <span className={classes.totalResults}>({resources?.length})</span>
                </Typography>
                <Grid container justifyContent="center">
                  <Typography color="primary" variant="h5">
                    No Resources Found
                  </Typography>
                </Grid>
              </>
            ) : null}

            {hasError && !isLoading && (
              <Typography align="center" error>
                Unable to display resources
              </Typography>
            )}

            {isLoading && (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default ResourceLibrary;
