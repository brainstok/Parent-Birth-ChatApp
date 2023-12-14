// Import dependencies
import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import InfiniteScrollList from 'src/components/common/InfiniteScrollList';
import { ChatContext } from 'src/context/ChatContext';
import SearchItem from '../SearchItem';
import clsx from 'clsx';

const SearchList = () => {
  const {
    searchData,
    isSearchLoading,
    handleSearchMessages,
    messageSearchQuery,
    currentSearchPage,
    totalSearchPages,
    listDisplayed,
    searchAccordionHeight,
  } = useContext(ChatContext);
  const [searchTotal, setSearchTotal] = useState(null);
  const [messages, setMessages] = useState(null);
  const [noMoreThreads, setNoMoreThreads] = useState(false);

  const handleGetMoreSearchResults = async () => {
    if (currentSearchPage <= totalSearchPages) {
      handleSearchMessages({ query: messageSearchQuery, page: currentSearchPage + 1 });
    } else {
      setNoMoreThreads(true);
    }
  };

  useEffect(() => {
    if (searchData) {
      setSearchTotal(searchData.total);
      setMessages(searchData.result);
    }
  }, [searchData]);

  const offset = searchAccordionHeight;

  return (
    <Box height={`calc(100% - ${offset}px)`}>
      <InfiniteScrollList
        total={searchTotal}
        isLoading={isSearchLoading}
        getMore={handleGetMoreSearchResults}
        noMore={noMoreThreads}
      >
        {messages?.map((message) => (
          <SearchItem key={message.id} message={message} />
        ))}
      </InfiniteScrollList>
    </Box>
  );
};
export default SearchList;
