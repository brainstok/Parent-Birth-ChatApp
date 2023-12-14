import React, { useState } from 'react';
import { Divider, Grid, Box, SvgIcon, IconButton, makeStyles } from '@material-ui/core';
import CrmButtonSelect from 'src/components/common/CrmButtonSelect';
import CrmSelect from 'src/components/common/CrmSelect';
import {
  Trash as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  XCircle as CloseIcon,
} from 'react-feather';
import CrmDisplayText from 'src/components/common/CrmDisplayText';
import CrmDisplayChips from 'src/components/common/CrmDisplayChips';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  editIconStyle: {
    marginRight: 26,
  },
}));

const validationSchema = Yup.object().shape({
  topic: Yup.object().required('Required').typeError('Required'),
});

const EditTopics = ({ handleEditTopic, patientId, setIsEdit, topic }) => {
  const initialValues = {
    topic: { ...topic, id: topic.topicId },
    subtopics: topic?.subtopics,
  };

  const handleSubmit = async (values) => {
    handleEditTopic(values);
  };

  return (
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
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={8}>
                    <CrmButtonSelect
                      value={values.topic}
                      patientId={patientId}
                      renderInputLabel="Topic"
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
                  <Grid item>
                    <IconButton type="submit" disabled={!isValid}>
                      <SvgIcon>
                        <SaveIcon size={18} />
                      </SvgIcon>
                    </IconButton>
                    <IconButton onClick={() => setIsEdit(false)}>
                      <SvgIcon>
                        <CloseIcon size={18} />
                      </SvgIcon>
                    </IconButton>
                  </Grid>
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
              </Grid>
            </form>
          );
        }}
      </Formik>
      <Divider width="100%" />
    </Box>
  );
};

const Topic = ({ topic, patientId, handleDeleteTopic }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [topicValue, setTopicValue] = useState(topic);

  const EditTopic = async (values) => {
    try {
      const topicUpdated = {
        id: topic.id,
        topicId: values?.topic.id,
        label: values?.topic.label,
      };
      const updatedSubtopics = values?.subtopics;

      await axios.put(`/api/patients/${patientId}/topic/${topic?.id}`, {
        topic: topicUpdated,
        subtopics: updatedSubtopics,
      });
      const updatedTopicValue = {
        ...topicUpdated,
        subtopics: updatedSubtopics,
      };
      setTopicValue(updatedTopicValue);
      setIsEdit(false);
    } catch (error) {
      toast.error(`Error updating topics`);
      setIsEdit(false);
    }
  };

  return (
    <React.Fragment>
      {isEdit ? (
        <EditTopics
          handleEditTopic={EditTopic}
          patientId={patientId}
          setIsEdit={setIsEdit}
          topic={topicValue}
        />
      ) : (
        <Box p={2}>
          <div style={{ marginBottom: '1rem' }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={4}>
                <CrmDisplayText primary={'Topic'} type="text" secondary={topicValue.label} />
              </Grid>
              <Grid item xs={4}>
                <CrmDisplayChips values={topicValue.subtopics} label="Subtopics" />
              </Grid>
              <Grid item>
                <IconButton onClick={() => setIsEdit(true)}>
                  <SvgIcon>
                    <EditIcon size={18} />
                  </SvgIcon>
                </IconButton>
                <IconButton onClick={() => handleDeleteTopic(topic.id)}>
                  <SvgIcon>
                    <DeleteIcon size={18} />
                  </SvgIcon>
                </IconButton>
              </Grid>
            </Grid>
          </div>
          <Divider width="100%" />
        </Box>
      )}
    </React.Fragment>
  );
};

export default Topic;
