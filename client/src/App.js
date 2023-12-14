import { ThemeProvider } from '@material-ui/core';
import { createTheme } from './theme';
import routes, { renderRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from 'src/components/common/GlobalStyles';
import { ToastContainer } from 'react-toastify';
import { CssBaseline } from '@material-ui/core';
import { ChatContextProvider } from 'src/context/ChatContext';
import { UserContextProvider } from 'src/context/UserContext';
import { ResourceContextProvider } from './context/ResourceContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <UserContextProvider>
          <ChatContextProvider>
            <ResourceContextProvider>
              <CssBaseline />
              <GlobalStyles />
              <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
            </ResourceContextProvider>
          </ChatContextProvider>
        </UserContextProvider>
      </MuiPickersUtilsProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
