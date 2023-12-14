import React, { useEffect, useState } from 'react';
import { Card, CardHeader, Divider, Button, Grid, Box } from '@material-ui/core';
import CrmButtonSelect from 'src/components/common/CrmButtonSelect';
import CrmSelect from 'src/components/common/CrmSelect';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import Topic from './Topic';

const initialValues = {
  topic: null,
  subtopics: null,
};

const validationSchema = Yup.object().shape({
  topic: Yup.object().required('Required').typeError('Required'),
});

const Topics = ({ patientId, patientTopics: initialTopics }) => {
  const [topics, setTopics] = useState();

  const handleDeleteTopic = async (patientTopicId) => {
    try {
      const { data: newTopics } = await axios.delete(
        `/api/patients/${patientId}/topic/${patientTopicId}`
      );

      setTopics(newTopics);
    } catch (error) {
      toast.error(`Error deleting topic`);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { data: newTopics } = await axios.post(`/api/patients/${patientId}/topic`, values);
      setTopics(newTopics);
      resetForm();
    } catch (error) {
      toast.error(`Error submitting topics`);
    }
  };

  useEffect(() => {
    if (initialTopics) {
      setTopics(initialTopics);
    }
  }, [initialTopics]);

  return (
    <Card>
      <Box p={2}>
        <CardHeader title="Topics" p={2} />
        <Divider />
        {topics?.map((topic, idx) => (
          <Topic
            topic={topic}
            key={`topic-${topic?.id}-${idx}`}
            handleDeleteTopic={handleDeleteTopic}
            patientId={patientId}
          />
        ))}
        <Box p={2}>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, setFieldValue, setFieldError, handleSubmit, isValid }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <CrmButtonSelect
                        value={values.topic}
                        patientId={patientId}
                        name="topic"
                        slug="topic"
                        hasError={Boolean(errors.topic)}
                        onChange={(value) => {
                          setFieldValue('topic', value);
                          setFieldValue('subtopics', []);
                          setFieldError('topic', undefined);
                        }}
                      />
                    </Grid>

                    {values.topic ? (
                      <Grid item>
                        <CrmSelect
                          selectedOptions={values.subtopics}
                          label="Subtopics"
                          apiSlug={`subtopic?topicId=${values.topic.id}`}
                          patientId={patientId}
                          hasError={Boolean(errors.subtopics)}
                          onChange={(value) => {
                            setFieldValue('subtopics', value);
                            setFieldError('subtopics', undefined);
                          }}
                        />
                      </Grid>
                    ) : null}
                    <Grid container item direction="row-reverse">
                      <Button disabled={!isValid} variant="contained" color="primary" type="submit">
                        Add Topic
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Card>
  );
};

export default Topics;
