import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  Card,
  InputAdornment,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  colors,
  makeStyles,
} from '@material-ui/core';
import { Edit as EditIcon, Search as SearchIcon, Trash as DeleteIcon } from 'react-feather';
import { PersonAdd as AddPersonIcon } from '@material-ui/icons';
import getInitials from 'src/utils/getInitials';
import AddEditModal from './AddEditModal';
import { MODALITIES } from 'src/constants';
import DeleteConfirmModal from '../../common/DeleteConfirmModal/index.js';

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500,
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
}));

const applyFilters = ({ providers, query }) => {
  return providers?.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['firstName', 'lastName', 'email'];
      let containsQuery = false;
      properties.forEach((property) => {
        if (user[property]?.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });
      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = ({ providers, page, limit }) => {
  return providers.slice(page * limit, page * limit + limit);
};

const ProvidersTable = ({ isUserAdmin, providers, setProviders, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);
  const [providerToDelete, setProviderToDelete] = useState(null);

  const handleQueryChange = (event) => {
    event.persist();
    const query = event.target.value;
    setQuery(query);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProviders = applyFilters({ providers, query });
  const paginatedProviders = applyPagination({
    providers: filteredProviders,
    page,
    limit,
  });

  return (
    <>
      <Card className={clsx(classes.root)} {...rest}>
        <Box p={2}>
          <Box display="flex" alignItems="center">
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
              placeholder="Search Providers"
              value={query}
              variant="outlined"
            />
            <Box flexGrow={1} />
            {/* <Button
              startIcon={<AddPersonIcon />}
              className={classes.button}
              variant="contained"
              onClick={() => setIsAddEditModalOpen(true)}
            >
              Add Provider
            </Button> */}
          </Box>
        </Box>

        <PerfectScrollbar>
          <Box minWidth={1200}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Focus</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProviders?.map((provider, index) => {
                  return (
                    <TableRow hover key={index}>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar className={classes.avatar} src={provider.avatarLink}>
                            {getInitials(`${provider.firstName} ${provider.lastName}`)}
                          </Avatar>
                          <Box ml={2}>
                            {provider.firstName} {provider.lastName}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{MODALITIES[provider.modalityId]}</TableCell>

                      <TableCell>{provider.email}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            setProviderToEdit(provider);
                            setIsAddEditModalOpen(true);
                          }}
                        >
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        </IconButton>

                        {isUserAdmin && (
                          <IconButton
                            onClick={() => {
                              setProviderToDelete(provider);
                              setIsDeleteConfirmModalOpen(true);
                            }}
                          >
                            <SvgIcon fontSize="small">
                              <DeleteIcon />
                            </SvgIcon>
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={filteredProviders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      <AddEditModal
        setIsOpen={setIsAddEditModalOpen}
        isOpen={isAddEditModalOpen}
        setProvider={setProviderToEdit}
        providers={providers}
        setProviders={setProviders}
        provider={providerToEdit}
      />

      <DeleteConfirmModal
        users={providers}
        isOpen={isDeleteConfirmModalOpen}
        setIsOpen={setIsDeleteConfirmModalOpen}
        user={providerToDelete}
        setUser={setProviderToDelete}
        setUsers={setProviders}
        type={'users'}
      />
    </>
  );
};

ProvidersTable.propTypes = {
  providers: PropTypes.array.isRequired,
  setProviders: PropTypes.func,
};

ProvidersTable.defaultProps = {
  providers: [],
};

export default ProvidersTable;
