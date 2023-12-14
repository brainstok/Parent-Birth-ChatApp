import {
  Box,
  Typography,
  makeStyles,
  IconButton,
  SvgIcon,
  Avatar,
  Grid,
  Chip,
} from '@material-ui/core';

import { Trash as DeleteIcon, Edit as EditIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  iconClass: { color: theme.palette.primary.main, cursor: 'pointer' },
  taggedProviderChip: {
    margin: theme.spacing(0.5),
  },
}));

const Note = ({ body, onEdit, noteId, provider, onDelete, taggedProviders }) => {
  const { iconClass, taggedProviderChip } = useStyles();

  return (
    <Box mb={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" position="relative">
        <Typography color="primary" style={{ fontSize: 12 }}>
          {provider?.firstName} {provider?.lastName}:
        </Typography>

        <Box position="absolute" right={0}>
          <IconButton size="small" onClick={() => onEdit(noteId)}>
            <SvgIcon>
              <EditIcon size={18} className={iconClass} />
            </SvgIcon>
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(noteId)}>
            <SvgIcon>
              <DeleteIcon size={18} className={iconClass} />
            </SvgIcon>
          </IconButton>
        </Box>
      </Box>
      <Box mb={1}>{body}</Box>
      {Boolean(taggedProviders.length) && (
        <Typography color="primary" style={{ fontSize: 12 }}>
          Tagged Providers:
        </Typography>
      )}
      <Box display="flex" flexWrap="wrap">
        {taggedProviders?.map((provider) => (
          <Chip
            className={taggedProviderChip}
            color="secondary"
            size="small"
            key={provider.id}
            avatar={<Avatar src={provider.avatarLink} />}
            label={provider.name}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Note;
