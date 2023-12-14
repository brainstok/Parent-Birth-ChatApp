import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Avatar,
  Typography,
  Grid,
  useMediaQuery,
  Chip,
  IconButton,
  SvgIcon,
} from '@material-ui/core';
import { Trash as DeleteIcon } from 'react-feather';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '@material-ui/core/styles';
import { formatPhoneNumber } from 'react-phone-number-input';
import CrmButtonSelect from 'src/components/common/CrmButtonSelect';
import DeleteConfirmModal from 'src/components/common/DeleteConfirmModal';
import { LOCALE_OPTIONS } from 'src/constants';

const TopInfo = ({
  displayName,
  status,
  currentStage,
  phoneNumber,
  email,
  patientId,
  partner,
  zipCode,
  city,
  state,
  locale: initialLocale,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const history = useHistory();
  const [engagement, setEngagement] = useState('');
  const [patientValues, setPatientValues] = useState({});
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [locale, setLocale] = useState(null);

  const handleGetPatientEngagement = async (patientId) => {
    try {
      const { data: engagement } = await axios.get(`/api/patients/${patientId}/engagement`);
      setEngagement(engagement);
    } catch (error) {
      toast.error(`Error getting patient engagement`);
    }
  };

  const handleSetLocale = async (value) => {
    try {
      setLocale(value);

      await axios.put(`/api/patients/${patientId}`, {
        locale: value.locale,
      });
    } catch (error) {
      toast.error(`Error updating locale`);
    }
  };

  useEffect(() => {
    setPatientValues({
      patientId,
      displayName,
      phoneNumber,
      email,
    });

    handleGetPatientEngagement(patientId);
  }, []);

  // Set locale
  useEffect(() => {
    if (initialLocale === 'en') {
      setLocale(LOCALE_OPTIONS[1]);
    } else if (initialLocale === 'es') {
      setLocale(LOCALE_OPTIONS[2]);
    } else {
      setLocale(LOCALE_OPTIONS[0]);
    }
  }, [initialLocale]);

  return (
    <Card>
      <Box p={2}>
        <Grid container alignItems="center">
          <Grid item md={6} sm={12}>
            <Box display="flex" alignItems="center" paddingTop={1} paddingBottom={1}>
              <Box mr={1}>
                <Avatar color="primary">{displayName?.[0] || ''}</Avatar>
              </Box>

              <Box display="flex" justifyContent="center" flexDirection="column">
                <Box display="flex" alignItems="center" style={{ cursor: 'pointer' }}>
                  <Typography
                    style={{
                      marginRight: 5,
                    }}
                    onClick={() => {
                      history.push(`/chat?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
                        displayName: patientValues.displayName,
                      });
                    }}
                    variant="h4"
                  >{`${patientValues.displayName}`}</Typography>

                  <Chip
                    style={{ paddingTop: 3 }}
                    size="small"
                    label={engagement}
                    variant="outlined"
                  />
                  {partner?.id && <Chip size="small" label={partner.label} />}

                  <CrmButtonSelect
                    className={'autoCompleteChipClass'}
                    options={LOCALE_OPTIONS}
                    patientId={patientId}
                    value={locale}
                    name="locale"
                    onChange={(value) => {
                      handleSetLocale(value);
                    }}
                  />

                  <IconButton
                    onClick={() => {
                      setPatientToDelete(patientValues);
                      setIsDeleteConfirmModalOpen(true);
                    }}
                  >
                    <SvgIcon fontSize="small">
                      <DeleteIcon />
                    </SvgIcon>
                  </IconButton>
                </Box>

                <Typography variant="subtitle2">
                  {patientValues.email} | {formatPhoneNumber(patientValues.phoneNumber)}{' '}
                  {city && `| ${city}`} {state && `| ${state}`} | {zipCode}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            sm={12}
            md={6}
            item
            container
            spacing={1}
            justifyContent={isTablet ? 'flex-start' : 'flex-end'}
          >
            <Grid item sm={3} xs={12}>
              <CrmButtonSelect
                patientId={patientId}
                value={status}
                name="status"
                slug="status"
                classes={['greenButtonClass', 'redButtonClass']}
              />
            </Grid>

            <Grid item sm={4} xs={12}>
              <CrmButtonSelect
                patientId={patientId}
                value={currentStage}
                name="currentStage"
                isButton
                slug="stage"
                className="primaryButtonClass"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        setIsOpen={setIsDeleteConfirmModalOpen}
        patient={patientToDelete}
        setPatientToDelete={setPatientToDelete}
        type="patients"
      />
    </Card>
  );
};

export default TopInfo;
