import { useState, useContext, useEffect } from 'react';
import { UserContext } from 'src/context/UserContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Switch, FormControlLabel } from '@material-ui/core';
import { toast } from 'react-toastify';
const socket = io(null, { transports: ['websocket'] });

const getIsAway = async () => {
  try {
    const { data: isAway } = await axios.get('/api/settings/away');
    return isAway;
  } catch (error) {
    console.log(error);
  }
};

const updateUserSetting = async (isAway) => {
  try {
    const settings = await axios.put('/api/settings/away', { isAway });
    return isAway;
  } catch (error) {}
};

const AwayToggle = () => {
  const [isAway, setIsAway] = useState(false);
  const { user } = useContext(UserContext);

  const handleUpdateSetting = async (isAway) => {
    try {
      const settingsUpdated = await updateUserSetting(isAway, user);
      if (settingsUpdated) {
        setIsAway(isAway);
        toast.info('😴 Your status has been updated to away');
      } else {
        setIsAway(isAway);
        toast.success('🦄 Welcome back! You are no longer away');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error: Unable to set your current status. Please try again');
    } finally {
    }
  };

  useEffect(() => {
    (async () => {
      const isAway = await getIsAway();
      setIsAway(isAway);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('updateSettings', (settings) => {
      const { isAway } = settings;
      setIsAway(isAway);
    });
  }, []);

  return (
    <>
      <FormControlLabel
        onChange={() => handleUpdateSetting(!isAway)}
        control={<Switch checked={isAway} color="primary" />}
        label="Set to Away"
      />
    </>
  );
};

export default AwayToggle;
