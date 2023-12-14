import { createContext, useReducer } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isUserAdmin: action?.payload?.role === 'Admin',
      };

    case 'SET_USER_TAGS':
      return {
        ...state,
        user: {
          ...state.user,
          tags: action.payload,
        },
      };

    case 'SET_AUTH_TOKEN':
      return {
        ...state,
        authToken: action.payload,
      };

    default:
      return state;
  }
};

const UserContextProvider = (props) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const initialState = {
    user: null,
  };
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const setUserTags = (updatedTags) => {
    dispatch({ type: 'SET_USER_TAGS', payload: updatedTags });
  };

  const setUser = async (authToken) => {
    try {
      const { data } = await axios.get('/api/users/provider', {
        params: {
          auth0Id: user?.sub,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!data) {
        console.log('Cannot set user => user:', data);
      }

      dispatch({ type: 'SET_USER', payload: data });
    } catch (error) {
      // Edge case if auth token exists but api fails because user is not in DB
      //  TODO: redirect to login page if no user is found
    }
  };

  const setAuthToken = async () => {
    const authToken = await getAccessTokenSilently();
    // Set Bearer token globally across all axios request
    axios.defaults.headers['Authorization'] = `Bearer ${authToken}`;
    dispatch({ type: 'SET_AUTH_TOKEN', payload: authToken });
    return authToken;
  };

  const value = {
    ...userState,
    setUserTags,
    setUser,
    setAuthToken,
  };

  return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
};

const UserContextConsumer = UserContext.Consumer;

export { UserContextProvider, UserContextConsumer };
