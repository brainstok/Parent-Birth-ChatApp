import React, { useEffect, useContext, useState } from 'react';
import ThreadItem from '../ThreadItem';
import { ChatContext } from 'src/context/ChatContext';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { socket } from 'src/socket';
import InfiniteScrollList from 'src/components/common/InfiniteScrollList';

const ThreadList = () => {
  const {
    threadData,
    handleGetPatientThreads,
    areThreadsLoading,
    currentThreadsPage,
    totalThreadsPages,
    recipient,
    handleSetRecipient,
    handleSelectThread,
    selectedPhoneNumber,
    handleClearChat,
    searchAccordionHeight,
    listDisplayed,
  } = useContext(ChatContext);

  const [threads, setThreads] = useState(null);
  const [threadTotal, setThreadTotal] = useState(null);
  const [noMoreThreads, setNoMoreThreads] = useState(false);

  const handleGetMoreThreads = async () => {
    if (currentThreadsPage <= totalThreadsPages) {
      await handleGetPatientThreads({ page: currentThreadsPage + 1, hasLoading: true });
    } else {
      setNoMoreThreads(true);
    }
  };

  // Only get threads on first render
  useEffect(() => {
    (async () => {
      handleGetPatientThreads({ page: currentThreadsPage, hasLoading: true });
    })();

    return () => {
      // Clear recipient on unmount
      handleClearChat();
    };
  }, []);

  // Manage selecting a thread using the phonenumber
  useEffect(() => {
    (async () => {
      if (!recipient && selectedPhoneNumber) {
        handleSelectThread({ phoneNumber: selectedPhoneNumber });
      }
    })();
  }, [selectedPhoneNumber, recipient]);

  useEffect(() => {
    setThreads(threadData?.result);
    setThreadTotal(threadData?.total);

    const handleUpdateThreads = () => {
      handleGetPatientThreads({ page: currentThreadsPage });
    };

    const handleUpdateRecipient = () => {
      if (selectedPhoneNumber) {
        handleSetRecipient(selectedPhoneNumber);
      }
    };

    socket.on('update_threads', handleUpdateThreads);
    socket.on('update_threads', handleUpdateRecipient);
    return () => {
      socket.off('update_threads', handleUpdateThreads);
      socket.off('update_threads', handleUpdateRecipient);
    };
  }, [threadData, selectedPhoneNumber]);

  const filteredThreads = recipient
    ? threads?.filter((thread) => thread.id !== recipient.id)
    : threads;

  const offset = searchAccordionHeight + (recipient ? 57 : 0);

  return (
    <Box height={`calc(100% - ${offset}px)`}>
      {recipient && <ThreadItem thread={recipient} active />}

      <InfiniteScrollList
        total={threadTotal}
        isLoading={areThreadsLoading}
        getMore={handleGetMoreThreads}
        noMore={noMoreThreads}
      >
        {filteredThreads?.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </InfiniteScrollList>
    </Box>
  );
};

ThreadList.propTypes = {
  threads: PropTypes.array,
  selectedPhoneNumber: PropTypes.string,
};

export default ThreadList;
