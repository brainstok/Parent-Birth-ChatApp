import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Box, Button, SvgIcon } from '@material-ui/core';
import MessageItem from '../MessageItem';
import { ChatContext } from 'src/context/ChatContext';
import { socket } from 'src/socket';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ChevronLeft } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    height: 'calc(100%)',
    [theme.breakpoints.down('md')]: {
      paddingTop: 64,
    },
  },
  scrollableContainer: {
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    paddingTop: theme.spacing(2),
  },
  loading: {
    opacity: 0.5,
    pointerEvents: 'none',
  },

  navigationWrapper: {
    minHeight: '3rem',
    position: 'fixed',
    top: 64,
    backgroundColor: 'white',
    width: '100%',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const MessageList = () => {
  const {
    handleHideSidebar,
    handleGetThread,
    selectedPhoneNumber,
    messageData,
    currentThreadPage,
    isThreadLoading,
    selectedMessageId,
    handleGetPageNumberForSelectedMessage,
  } = useContext(ChatContext);
  
  const containerRef = useRef(null);
  const messageItemRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isFirstLoadComplete, setIsFirstLoadComplete] = useState(false);
  const classes = useStyles();

  const handleGetMoreThread = async () => {
    await handleGetThread({
      phoneNumber: selectedPhoneNumber,
      page: currentThreadPage + 1,
    });
  };

  // Set state on mount using messageData
  useEffect(() => {
    setMessages(messageData?.result);
  }, [messageData]);

  useEffect(() => {
    // Manage incoming messages
    const handleNewMessage = (message) => {
      const newMessages = [message, ...messages];
      setMessages(newMessages);
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [messages]);

  useEffect(() => {
    (async () => {
      // Check if we're viewing messages for a selected phone number
      let page = 1;
      if (!selectedPhoneNumber) return;
      
      setIsFirstLoadComplete(true);
      if (selectedMessageId) {
        page = await handleGetPageNumberForSelectedMessage({
          phoneNumber: selectedPhoneNumber,
          selectedMessageId,
        })
      }
      
      await handleGetThread({
        phoneNumber: selectedPhoneNumber,
        page: page,
      });
      setIsFirstLoadComplete(false);
    })();
    containerRef.current.scrollTop = 0;
  }, [selectedPhoneNumber, selectedMessageId]);

  useEffect(() => {
    // Scroll to the selected message when a new phone number or message is selected,
    // but only after the first load to avoid interfering with the initial rendering.
    if (isFirstLoadComplete) return
    messageItemRef.current?.scrollIntoView({
      block: "center",
      inline: "center",
    });
  }, [selectedMessageId, isFirstLoadComplete])

  return (
    <Box
      height="100%"
      id="scrollableDiv"
      className={classes.scrollableContainer}
      ref={containerRef}
    >
      <Box className={classes.navigationWrapper}>
        <Button
          onClick={() => handleHideSidebar(false)}
          startIcon={
            <SvgIcon size="small">
              <ChevronLeft />
            </SvgIcon>
          }
        >
          Back
        </Button>
      </Box>
      {/* {useMemo(() => {
        return ( */}
      <InfiniteScroll
        className={isThreadLoading && classes.loading}
        dataLength={messages?.length}
        next={handleGetMoreThread}
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        inverse={true}
        hasMore={messages?.length < messageData?.total}
        scrollableTarget="scrollableDiv"
      >
        {messages?.map((message, index) => (
            <MessageItem key={index} message={message} isSelected={message.id === selectedMessageId} ref={message?.id === selectedMessageId ? messageItemRef : null}/>
        ))}
      </InfiniteScroll>
      {/* // ); // }, [selectedPhoneNumber, messages, isThreadLoading])} */}
    </Box>
  );
};

MessageItem.propTypes = {
  className: PropTypes.string,
  Messages: PropTypes.array,
};

export default MessageList;
