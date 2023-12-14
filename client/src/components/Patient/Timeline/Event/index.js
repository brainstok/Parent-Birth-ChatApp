import { Trash as DeleteIcon, Edit as EditIcon } from 'react-feather';
import { Typography, Box, SvgIcon, IconButton } from '@material-ui/core';

const Event = ({ event, onDelete, onEdit }) => {
  return (
    <Box position="relative">
      <Typography style={{ fontSize: 14 }}>{event.eventType.label}</Typography>

      <Box position="absolute" right={0} top={0}>
        <IconButton size="small" onClick={() => onEdit(event)}>
          <SvgIcon>
            <EditIcon size={18} />
          </SvgIcon>
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(event.id)}>
          <SvgIcon>
            <DeleteIcon size={18} />
          </SvgIcon>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Event;
