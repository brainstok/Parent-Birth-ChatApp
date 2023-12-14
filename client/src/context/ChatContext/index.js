import { createContext, useReducer, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import usePrevious from 'src/utils/usePrevious';
import { socket } from 'src/socket';
import useDevice from 'src/utils/useDevice';
import {
  getThread,
  getPatientThreads,
  updateReadMessage,
  getRecipient,
  sendMessage,
  getMessages,
  getMessageIndex,
} from './api';

const PAGE_SIZE = 20;

export const ChatContext = createContext();

const highLightSearchResultText = (messages, keyword) => {
  messages?.forEach((message) => {
    let { body } = message;
    const searchExp = new RegExp(keyword, 'gi');
    body = body.replaceAll(searchExp, (match) => `<mark>${match}</mark>`);
    message.body = body;
  });
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ARE_THREADS_HIDDEN':
      return {
        ...state,
        areThreadsHidden: action.payload,
      };

    case 'SET_ARE_THREADS_LOADING':
      return {
        ...state,
        areThreadsLoading: action.payload,
      };

    case 'SET_IS_THREAD_LOADING':
      return {
        ...state,
        isThreadLoading: action.payload,
      };

    case 'SET_IS_SEARCH_LOADING':
      return {
        ...state,
        isSearchLoading: action.payload,
      };

    case 'SET_THREAD_DATA':
      return {
        ...state,
        threadData: action.payload,
      };

    case 'SET_RECIPIENT':
      return {
        ...state,
        recipient: action.payload,
      };

    case 'SET_MESSAGE_DATA':
      return {
        ...state,
        messageData: action.payload,
      };

    case 'SET_SEARCH_ACCORDION_HEIGHT':
      return {
        ...state,
        searchAccordionHeight: action.payload,
      };

    // Search
    case 'SET_MESSAGE_SEARCH_QUERY':
      return {
        ...state,
        messageSearchQuery: action.payload,
      };

    case 'SET_SEARCH_DATA':
      return {
        ...state,
        searchData: action.payload,
      };

    case 'SET_ARE_MESSAGES_LOADING':
      return {
        ...state,
        areMessagesLoading: action.payload,
      };

    case 'SET_LIST_DISPLAYED':
      return {
        ...state,
        listDisplayed: action.payload,
      };

    case 'SET_SELECTED_SEARCH_MESSAGE_ID':
      return {
        ...state,
        selectedMessageId: action.payload,
      };

    default:
      return state;
  }
};

const initialState = {
  areThreadsHidden: false,
  searchAccordionHeight: 0,
  recipient: null,

  areThreadsLoading: false,
  isThreadLoading: false,
  isSearchLoading: false,

  threadData: null,
  messageData: null,
  searchData: null,
  selectedMessageId: null,

  messageSearchQuery: null,

  listDisplayed: 'threads',
};

const ChatContextProvider = (props) => {
  const { user } = useAuth0();
  const [chatState, dispatch] = useReducer(chatReducer, initialState);
  const queryObj = queryString.parse(window.location.search);
  const { isMobile, isTablet, isDesktop } = useDevice();
  const threadsPaginationRef = useRef({
    currentPage: 1,
    totalPages: null,
  });
  const searchPaginationRef = useRef({
    currentPage: 1,
    totalPages: null,
  });
  const threadPaginationRef = useRef({
    currentPage: 1,
    totalPages: null,
  });

  const { phoneNumber: selectedPhoneNumber } = queryObj || null;
  const previousPhoneNumber = usePrevious(selectedPhoneNumber);

  // Ref Managers
  const manageThreadRefs = ({ newPage, totalPages }) => {
    threadsPaginationRef.current.currentPage = newPage;
    threadsPaginationRef.current.totalPages = totalPages;
  };

  const manageSearchResultRefs = ({ newPage, currentPage }) => {
    searchPaginationRef.current.currentPage = newPage;
    searchPaginationRef.current.totalPages = currentPage;
  };

  const manageThreadPaginationRefs = ({ newPage, currentPage }) => {
    threadPaginationRef.current.currentPage = newPage;
    threadPaginationRef.current.totalPages = currentPage;
  };

  // Setters

  const areThreadsLoading = (isLoading) => {
    dispatch({ type: 'SET_ARE_THREADS_LOADING', payload: isLoading });
  };

  const setIsThreadLoading = (isLoading) => {
    dispatch({ type: 'SET_IS_THREAD_LOADING', payload: isLoading });
  };

  const isSearchLoading = (isLoading) => {
    dispatch({ type: 'SET_IS_SEARCH_LOADING', payload: isLoading });
  };

  const setThreadData = (threadData) => {
    dispatch({ type: 'SET_THREAD_DATA', payload: threadData });
  };

  const setMessageData = (messageData) => {
    dispatch({ type: 'SET_MESSAGE_DATA', payload: messageData });
  };

  const setSearchData = (searchData) => {
    dispatch({ type: 'SET_SEARCH_DATA', payload: searchData });
  };

  const setMesssageQuery = (query) => {
    dispatch({ type: 'SET_MESSAGE_SEARCH_QUERY', payload: query });
  };

  const setRecipient = (recipient) => {
    dispatch({ type: 'SET_RECIPIENT', payload: recipient });
  };

  const setAreThreadsHidden = (areThreadsHidden) => {
    dispatch({ type: 'SET_ARE_THREADS_HIDDEN', payload: areThreadsHidden });
  };

  const setSearchAccordionHeight = (height) => {
    dispatch({ type: 'SET_SEARCH_ACCORDION_HEIGHT', payload: height });
  };

  const setListDisplayed = (listDisplayed) => {
    dispatch({ type: 'SET_LIST_DISPLAYED', payload: listDisplayed });
  };

  const setSelectedSearchMessageId = (selectedMessageId) => {
    dispatch({ type: 'SET_SELECTED_SEARCH_MESSAGE_ID', payload: selectedMessageId });
  };


  // Handlers
  const handleGetPatientThreads = async ({ page, hasLoading }) => {
    try {
      hasLoading && areThreadsLoading(true);

      const threadData = await getPatientThreads({
        limit: PAGE_SIZE * page,
      });
      setThreadData(threadData);

      manageThreadRefs({ newPage: page, totalPages: Math.ceil(threadData.total / PAGE_SIZE) });
    } catch (error) {
      toast.error(`Error getting messages`);
    } finally {
      hasLoading && areThreadsLoading(false);
    }
  };

  const handleJoinConversation = (phoneNumber) => {
    // Leave any previous conversations
    socket.emit('leaveConversation');
    // Join the new conversation
    socket.emit('joinConversation', phoneNumber);
  };

  const handleSelectThread = async (thread) => {
    // On mobile hide threads

    if (isTablet || isMobile) {
      setAreThreadsHidden(true);
    }
    try {
      handleJoinConversation(thread.phoneNumber);

      if (thread.hasUnreadPatientMessageIds) {
        await updateReadMessage({
          patientId: thread.id,
        });
      }
      let recipient = null;
      if (thread.id) {
        recipient = thread;
      } else {
        recipient = await getRecipient({
          phoneNumber: thread.phoneNumber,
        });
      }

      setRecipient(recipient);
    } catch (error) {
      toast.error(`Error getting selecting thread`);
    }
  };

  const handleSelectSearchMessage = async ({ messageId, phoneNumber }) => {
    setSelectedSearchMessageId(messageId);
    
    // On mobile hide threads
    if (isMobile) {
      setAreThreadsHidden(true);
    }
    try {
      const recipient = await getRecipient({
        phoneNumber: phoneNumber,
      });

      setRecipient(recipient);
    } catch (error) {
      toast.error(`Error getting selecting thread`);
    }
  };

  const handleSetRecipient = async (phoneNumber) => {
    try {
      const recipient = await getRecipient({
        phoneNumber,
      });
      setRecipient(recipient);
    } catch (error) {
      toast.error(`Error getting recipient`);
      return null;
    }
  };

  const handleClearChat = () => {
    socket.emit('leaveConversation');

    setMesssageQuery(null);
    setMessageData(null);
    setThreadData(null);
    setRecipient(null);
  };

  const handleGetPageNumberForSelectedMessage = async ({ phoneNumber, selectedMessageId }) => {
    try {
      setIsThreadLoading(true);
      const { messageIndex } = await getMessageIndex({
        phoneNumber,
        selectedMessageId,
      });

      const page = Math.ceil(parseInt(messageIndex) / PAGE_SIZE);
      return page;
    } catch(error) {
      toast.error(`Error getting messages`);
      return null;
    }
  }

  const handleGetThread = async ({ phoneNumber, page }) => {
    try {
      setIsThreadLoading(true);

      const messageData = await getThread({
        phoneNumber,
        limit: PAGE_SIZE * page,
      });

      manageThreadPaginationRefs({
        newPage: messageData.page || page,
        currentPage: Math.ceil(messageData.total / PAGE_SIZE),
      });

      setMessageData(messageData);
    } catch (error) {
      toast.error(`Error getting messages`);
      return null;
    } finally {
      setIsThreadLoading(false);
    }
  };

  const handleSendMessage = async ({ body, phoneNumber }) => {
    try {
      await sendMessage({
        auth0Id: user.sub,
        body,
        phoneNumber,
      });
    } catch (error) {
      toast.error(`Error sending message`);
    }
  };

  const handleSearchMessages = async ({ query, page }) => {
    try {
      isSearchLoading(true);

      const searchData = await getMessages({
        ...query,
        limit: page * PAGE_SIZE,
      });

      const { keyword } = query || {};
      if (keyword) {
        highLightSearchResultText(searchData.result, keyword);
      }

      setSearchData(searchData);

      manageSearchResultRefs({
        newPage: page,
        currentPage: Math.ceil(searchData.total / PAGE_SIZE),
      });
    } catch (error) {
      toast.error(`Error searching messages`);
    } finally {
      isSearchLoading(false);
    }
  };

  const handleSetMessageQuery = (query) => {
    try {
      if (query) {
        setListDisplayed('search');
      } else {
        setListDisplayed('threads');
      }

      setMesssageQuery(query);
    } catch (error) {
      toast.error(`Error setting query string`);
    }
  };

  const handleHideSidebar = (isHidden) => {
    setAreThreadsHidden(isHidden);
  };

  const handleSetAccordionHeight = () => {
    const searchAccordian = document.getElementById('search-accordion');

    const accordionHeight = searchAccordian?.offsetHeight;

    setSearchAccordionHeight(accordionHeight);
  };

  useEffect(() => {
    if (chatState.messageSearchQuery) {
      handleSearchMessages({
        query: chatState.messageSearchQuery,
        page: searchPaginationRef.current.currentPage,
      });
    } else {
      setSelectedSearchMessageId(null);
    }
  }, [chatState.messageSearchQuery]);

  const value = {
    // Variables
    ...chatState,
    // Refs
    currentThreadsPage: threadsPaginationRef.current.currentPage,
    totalThreadsPages: threadsPaginationRef.current.totalPages,
    currentSearchPage: searchPaginationRef.current.currentPage,
    totalSearchPages: searchPaginationRef.current.totalPages,
    currentThreadPage: threadPaginationRef.current.currentPage,
    totalThreadPages: threadPaginationRef.current.totalPages,
    socket,
    selectedPhoneNumber,
    previousPhoneNumber,
    // Handlers
    handleSelectSearchMessage,
    handleGetPatientThreads,
    handleSelectThread,
    handleSetRecipient,
    handleClearChat,
    handleGetThread,
    handleSendMessage,
    handleJoinConversation,
    handleSearchMessages,
    handleSetMessageQuery,
    handleHideSidebar,
    handleSetAccordionHeight,
    handleGetPageNumberForSelectedMessage,

    // Managers
    manageThreadRefs,
  };

  return <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>;
};

const ChatContextConsumer = ChatContext.Consumer;

export { ChatContextProvider, ChatContextConsumer };
