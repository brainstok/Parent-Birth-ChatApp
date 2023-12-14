import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { formatPhoneNumber } from 'react-phone-number-input';
import DeleteConfirmModal from '../../common/DeleteConfirmModal/index.js';
import moment from 'moment';
import isPastDate from 'src/utils/isPastDate.js';
import {
  Avatar,
  Box,
  Card,
  InputAdornment,
  Link,
  SvgIcon,
  TextField,
  colors,
  makeStyles,
  Chip,
  CardHeader,
  Grid,
  Button,
  CircularProgress,
  Tab,
  Tabs,
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import getInitials from 'src/utils/getInitials';
import { DataGrid } from '@mui/x-data-grid';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import useDevice from 'src/utils/useDevice.js';
import DatePicker from 'src/components/common/DatePicker/index.js';

const useStyles = makeStyles((theme) => ({
  datePickerGrid: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  csvButton: {
    height: '100%',
  },

  divider: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

  filterButton: {
    height: '100%',
  },

  queryField: {
    width: '100%',
    '& input': {
      fontSize: 16,
      padding: 10,
      height: 40,
    },
  },
  statusField: {
    flexBasis: 200,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: colors.common.white,
  },
  button: {
    backgroundColor: theme.palette.callToAction.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.callToAction.hover,
    },
  },
  inactiveChip: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  activeChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
  },
  pastDueClass: {
    color: theme.palette.error.main,
    background: theme.palette.error.light,
  },
  activeButton: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
  },
}));

const PatientTable = ({ patients, setPatients, title, isUserAdmin }) => {
  const classes = useStyles();
  const { isMobile } = useDevice();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(100);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    fromDate: null,
    toDate: null,
  });
  const [locale, setLocale] = useState('all');

  const [filteredPatients, setFilteredPatients] = useState(patients);

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [exportData, setExportData] = useState([]);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const csvLink = useRef();

  const handleCsvExport = async () => {
    try {
      setIsExportLoading(true);
      const { data: exportData } = await axios.get('/api/patients/export');

      setExportData(exportData);
      csvLink.current.link.click();
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsExportLoading(false);
    }
  };

  const handleQueryChange = (event) => {
    event.persist();
    const query = event.target.value;
    setQuery(query);
  };

  const handleDateFilter = () => {
    setDateFilter({ fromDate, toDate });
  };

  const applyFilters = ({ patients, query, dateFilter, locale }) => {
    const searchStrings = query.toLowerCase().replace(/\s+/g, ' ').trim().split(' ');

    return patients?.filter((patient) => {
      const patientInfo = `${patient?.displayName?.trim()}`.toLowerCase();
      const patientDate = new Date(patient?.followUpDate);

      const hasKeyWord = searchStrings.every((el) => patientInfo.includes(el.toLowerCase()));
      const isAfterFromDate = !dateFilter?.fromDate || patientDate >= dateFilter?.fromDate;
      const isBeforeToDate = !dateFilter?.toDate || patientDate <= dateFilter?.toDate;

      const isLocale = locale === 'all' || patient.locale === locale;

      return hasKeyWord && isAfterFromDate && isBeforeToDate && isLocale;
    });
  };

  const columns = [
    {
      field: 'displayName',
      headerName: 'Name',
      sortable: false,
      flex: 1,
      renderCell: ({ row: patient }) => {
        return (
          <Box display="flex" alignItems="center">
            <Avatar className={classes.avatar} variant="rounded">
              {patient.displayName?.[0] || ''}
            </Avatar>
            <Box ml={2}>
              <Link
                variant="subtitle2"
                color="textPrimary"
                component={RouterLink}
                underline="none"
                to={`/patients/${patient.id}`}
                state={{
                  ...patient,
                }}
              >
                {patient.displayName}
              </Link>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'provider',
      headerName: 'Provider',
      sortable: false,
      flex: 1,
      renderCell: ({ row: patient }) => {
        return (
          <Box display="flex" alignItems="center">
            {patient.provider.firstName ? (
              <>
                <Avatar className={classes.avatar} src={`${patient.provider.avatarLink}`}>
                  {getInitials(`${patient.provider.firstName} ${patient.provider.lastName}`)}
                </Avatar>
                <Box ml={2}>
                  {patient.provider.firstName} {patient.provider.lastName}
                </Box>
              </>
            ) : (
              '-'
            )}
          </Box>
        );
      },
    },
    {
      field: 'followUpDate',
      headerName: 'Follow Up Date',
      flex: 1,
      // sortable: true,
      type: 'date',
      renderCell: ({ row: patient }) => {
        const isPastDue = isPastDate(patient.followUpDate2);
        return (
          <Chip
            label={patient.followUpDate ? moment.utc(patient.followUpDate).format('L') : '-'}
            className={clsx(isPastDue && classes.pastDueClass)}
          />
        );
      },
      sortComparator: (date1, date2) => {
        let dateA = Date.parse(date1) || 0;
        let dateB = Date.parse(date2) || 0;

        if (!dateA) {
          return 1;
        }

        if (!dateB) {
          return -1;
        }

        if (dateA === dateB) {
          return 0;
        }

        return dateA < dateB ? -1 : 1;
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      sortable: false,
      flex: 1,
      valueFormatter: ({ row: patient }) => formatPhoneNumber(patient.phoneNumber),
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: false,
      flex: 1,
      // valueFormatter: ({ row: patient }) => patient.email,
    },
  ];

  const tabs = [
    {
      value: 'all',
      label: 'All',
    },
    {
      value: 'es',
      label: 'Spanish',
    },
  ];

  useEffect(() => {
    setFilteredPatients(applyFilters({ patients, query, dateFilter, locale }));
  }, [patients, query, dateFilter, locale]);

  return (
    <Grid container spacing={2}>
      {/* Download CSV Button */}
      {isUserAdmin && (
        <Grid item>
          {isExportLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Box marginLeft={isMobile ? 3 : 0}>
              <Button
                onClick={handleCsvExport}
                color="primary"
                variant="contained"
                className={classes.csvButton}
                fullWidth
              >
                Download CSV
              </Button>
            </Box>
          )}
          <CSVLink
            data={exportData}
            filename="patients.csv"
            className="hidden"
            ref={csvLink}
            target="_blank"
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Card>
          <Box p={1}>
            <Grid container spacing={2} alignItems="center">
              {/* CardHeader & Tabs */}
              <Grid item container xs={12} md={4} spacing={1} alignItems="center">
                <Grid item xs={3} md={12}>
                  <CardHeader title={title} titleTypographyProps={{ variant: 'h5' }} />
                </Grid>
                <Grid item xs={9} md={12}>
                  <Tabs
                    value={locale}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, newTabIndex) => setLocale(newTabIndex)}
                    aria-label="filter group"
                  >
                    {tabs.map((tab) => (
                      <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                  </Tabs>
                </Grid>
              </Grid>

              {/* Filter Container */}
              <Grid
                item
                xs={12}
                md={8}
                container
                spacing={2}
                justifyContent="flex-end"
                className={classes.filterContainer}
              >
                {/* Date Filter */}
                <Grid
                  item
                  container
                  md={6}
                  xs={12}
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={2}
                >
                  {/* From date */}
                  <Grid item xs={12} md={5} className={classes.datePickerGrid}>
                    <DatePicker
                      onChange={(newValue) => setFromDate(newValue)}
                      label="FROM"
                      value={fromDate}
                    />
                  </Grid>
                  <Box component="div" className={classes.divider} width={40} textAlign="center">
                    {'-'}
                  </Box>
                  {/* To Date */}
                  <Grid xs={12} md={5} item className={classes.datePickerGrid}>
                    <DatePicker
                      onChange={(newValue) => setToDate(newValue)}
                      label="TO"
                      value={toDate}
                    />
                  </Grid>
                </Grid>
                {/* Search Active Patient */}
                <Grid container item xs={12} md={6} spacing={2}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      className={classes.queryField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon fontSize="small">
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleQueryChange}
                      placeholder={`Search ${title}`}
                      value={query}
                      variant="outlined"
                    />
                  </Grid>
                  {/* Filter Button */}
                  <Grid item md={6} xs={12}>
                    <Button
                      fullWidth
                      onClick={handleDateFilter}
                      color="primary"
                      variant="contained"
                      className={classes.filterButton}
                    >
                      Filter
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {/* Table */}
          <PerfectScrollbar>
            <Box minWidth={1200}>
              <DataGrid
                rows={filteredPatients}
                columns={columns}
                sortingOrder={['desc', 'asc']}
                disableColumnMenu
                autoHeight
                pageSize={page}
                onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                rowsPerPageOptions={[5, 10, 25]}
                pagination
                rowHeight={80}
              />
            </Box>
          </PerfectScrollbar>
        </Card>

        <DeleteConfirmModal
          users={patients}
          isOpen={isDeleteConfirmModalOpen}
          setIsOpen={setIsDeleteConfirmModalOpen}
          user={patientToDelete}
          setUser={setPatientToDelete}
          setUsers={setPatients}
          type="patients"
        />
      </Grid>
    </Grid>
  );
};

PatientTable.propTypes = {
  className: PropTypes.string,
  patients: PropTypes.array.isRequired,
};

PatientTable.defaultProps = {
  patients: [],
};

export default PatientTable;
