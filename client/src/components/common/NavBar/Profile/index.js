import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from 'src/context/UserContext';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from 'axios';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Box,
  Link,
} from '@material-ui/core';

const Profile = () => {
  const { user: provider } = useContext(UserContext);

  if (!provider) {
    return null;
  }

  const hasActiveTag = provider.tags.some((tag) => !tag.isCompleted);

  return (
    <Box>
      <Divider />
      <Link
        variant="subtitle2"
        color="textPrimary"
        component={RouterLink}
        underline="none"
        to="/profile"
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar src={provider?.avatarLink} />
          </ListItemAvatar>
          <ListItemText
            primary={`${provider?.firstName} ${provider?.lastName}`}
            secondary={provider?.email}
          />
          {provider?.tags.length > 0 && hasActiveTag && <NotificationsIcon color="error" />}
        </ListItem>
      </Link>
    </Box>
  );
};

export default Profile;
