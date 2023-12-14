import { useState, useEffect, useContext } from 'react';
import { ResourceContext } from 'src/context/ResourceContext';
import { makeStyles, Grid, TextField, InputAdornment, Button, Chip } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  searchButton: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
}));

const getResourceTopics = async () => {
  try {
    const { data: topicOptions } = await axios.get('/api/resources/topics');
    return topicOptions || [];
  } catch (error) {
    console.log(error);
    toast.error(`Error getting resource topics`);
  }
};

const getResourceSubtopics = async (topicId) => {
  try {
    const { data: subtopicOptions } = await axios.get(`/api/resources/topics/${topicId}/subtopics`);
    return subtopicOptions;
  } catch (error) {
    console.log(error);
    toast.error(`Error getting resource subtopics`);
  }
};

const ResourcesSearch = ({ handleSearchResources }) => {
  const { setTopic, topic, setSubtopics, subtopics, setSearchText, searchText } =
    useContext(ResourceContext);
  const classes = useStyles();
  const [topicOptions, setTopicOptions] = useState([]);
  const [subtopicOptions, setSubtopicOptions] = useState([]);

  const handleTopicClick = async (isCheck, topic) => {
    if (!isCheck) {
      const { id: topicId } = topic;
      const newSubtopicOptions = await getResourceSubtopics(topicId);

      setSubtopicOptions(newSubtopicOptions);
      setSubtopics([]);
      setTopic(topic);
    } else {
      setSubtopics([]);
      setTopic(null);
      setSubtopicOptions(null);
    }
  };

  const handleSubtopicClick = (isCheck, subtopic) => {
    if (!isCheck) {
      const newSubtopics = [...subtopics, subtopic];
      setSubtopics(newSubtopics);
    } else {
      const newSubtopics = subtopics.filter((item) => item.id !== subtopic.id);
      setSubtopics(newSubtopics);
    }
  };

  // setTopicOptions
  useEffect(() => {
    (async () => {
      const topicOptions = await getResourceTopics();
      setTopicOptions(topicOptions);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              value={searchText}
              variant="outlined"
              type="text"
              placeholder="Search By Keyword"
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => (e.key === 'Enter' ? handleSearchResources() : null)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              className={classes.searchButton}
              onClick={handleSearchResources}
              fullWidth
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={1}>
          {topicOptions?.map((topicOption) => {
            const isCheck = topicOption.id === topic?.id;

            return (
              <Grid item key={topicOption.id}>
                <Chip
                  key={topicOption.id}
                  onClick={() => handleTopicClick(isCheck, topicOption)}
                  label={topicOption.label}
                  color={isCheck ? 'primary' : 'secondary'}
                />
              </Grid>
            );
          })}
        </Grid>
        {topicOptions?.length && subtopicOptions?.length ? (
          <Grid item container xs={12} spacing={2}>
            {subtopicOptions.map((subtopic) => {
              const isCheck = subtopics.some((item) => item.id === subtopic.id);

              return (
                <Grid key={subtopic.id} item>
                  <Chip
                    onClick={() => handleSubtopicClick(isCheck, subtopic)}
                    label={subtopic.label}
                    color={isCheck ? 'primary' : 'secondary'}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default ResourcesSearch;
