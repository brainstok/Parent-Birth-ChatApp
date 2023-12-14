import { createContext, useReducer } from 'react';

export const ResourceContext = createContext();

const initialState = {
  searchText: '',
  topic: null,
  subtopics: [],
  resources: [],
  hasNoResources: null,
  hasError: false,
  isLoading: false,
};

const resourceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.payload,
      };
    case 'SET_TOPIC':
      return {
        ...state,
        topic: action.payload,
      };
    case 'SET_SUBTOPICS':
      return {
        ...state,
        subtopics: action.payload,
      };
    case 'SET_RESOURCES':
      return {
        ...state,
        resources: action.payload,
      };
    case 'SET_HAS_NO_RESOURCES':
      return {
        ...state,
        hasNoResources: action.payload,
      };
    case 'SET_HAS_ERROR':
      return {
        ...state,
        hasError: action.payload,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESET':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const ResourceContextProvider = (props) => {
  const [resourceState, dispatch] = useReducer(resourceReducer, initialState);

  const setSearchText = (searchText) => {
    dispatch({ type: 'SET_SEARCH_TEXT', payload: searchText });
  };

  const setTopic = (topic) => {
    dispatch({ type: 'SET_TOPIC', payload: topic });
  };
  const setSubtopics = (subtopics) => {
    dispatch({ type: 'SET_SUBTOPICS', payload: subtopics });
  };
  const setResources = (resources) => {
    dispatch({ type: 'SET_RESOURCES', payload: resources });
  };
  const setHasNoResources = (hasNoResources) => {
    dispatch({ type: 'SET_HAS_NO_RESOURCES', payload: hasNoResources });
  };
  const setHasError = (hasError) => {
    dispatch({ type: 'SET_HAS_ERROR', payload: hasError });
  };
  const setIsLoading = (isLoading) => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
  };
  const setReset = () => {
    dispatch({ type: 'RESET' });
  };

  const value = {
    ...resourceState,
    setSearchText,
    setTopic,
    setSubtopics,
    setResources,
    setHasNoResources,
    setHasError,
    setIsLoading,
    setReset,
  };

  return <ResourceContext.Provider value={value}>{props.children}</ResourceContext.Provider>;
};

const ResourceContextConsumer = ResourceContext.Consumer;

export { ResourceContextProvider, ResourceContextConsumer };
