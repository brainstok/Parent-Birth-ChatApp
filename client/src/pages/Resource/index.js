import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import useDevice from 'src/utils/useDevice';
import axios from 'axios';
import {
  makeStyles,
  Grid,
  Typography,
  Card,
  IconButton,
  Button,
  Chip,
  CardHeader,
  CardContent,
  CircularProgress,
  Link,
} from '@material-ui/core';
import { Search as SearchIcon, FileCopy, ArrowBackIos } from '@material-ui/icons';
import Page from 'src/components/common/Page';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  card: {
    [theme.breakpoints.up('lg')]: {
      width: '790px',
    },
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(3),
    },
  },
  backButtonMobile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '10px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '5px',
    backgroundColor: theme.palette.primary.main,
  },
}));

const getResource = async (resourceId) => {
  const { data: resource } = await axios.get(`/api/resources/${resourceId}`);
  return resource;
};

const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text).then(() => toast.success('text copied!'));
  } catch (err) {
    toast.error(`Error copying text`);
    console.log(err);
  }
};

const Resource = () => {
  const classes = useStyles();
  const { resourceId } = useParams();
  const { isMobile } = useDevice();
  const [resource, setResource] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const resource = await getResource(resourceId);
        setResource(resource);
      } catch (error) {
        setHasError(true);
        toast.error(`Error finding resource`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [resourceId]);

  return (
    <Page className={classes.root} title={resource?.title}>
      {hasError && !isLoading && (
        <Typography align="center" error>
          No Resource Found
        </Typography>
      )}

      {!resource && isLoading && (
        <Grid container justifyContent="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}

      {resource && !isLoading && (
        <Card className={classes.card}>
          <CardHeader
            title={resource?.title}
            titleTypographyProps={{ variant: 'h4' }}
            action={
              <Link color="primary" to="/resource-library" component={RouterLink} underline="none">
                {isMobile ? (
                  <IconButton className={classes.backButtonMobile} color="secondary" size="small">
                    <ArrowBackIos />
                  </IconButton>
                ) : (
                  <Button color="primary" variant="contained" startIcon={<SearchIcon />}>
                    Back to Search
                  </Button>
                )}
              </Link>
            }
          />
          <CardContent>
            <Grid container spacing={1}>
              {resource?.topic ? (
                <Grid item container spacing={1}>
                  <Grid item>
                    <Chip label={resource?.topic.title} color="primary" />
                  </Grid>
                  {resource?.subtopics
                    ? resource.subtopics.map((subtopic) => (
                        <Grid key={subtopic?.id} item>
                          <Chip label={subtopic?.label} color="primary" />
                        </Grid>
                      ))
                    : null}
                </Grid>
              ) : null}
              <Grid item>
                <Typography>{resource?.body}</Typography>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<FileCopy />}
                  onClick={() => handleCopy(resource?.body)}
                >
                  Copy
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Page>
  );
};

export default Resource;
