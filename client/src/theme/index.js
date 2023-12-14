import _ from 'lodash';
import { colors, responsiveFontSizes } from '@material-ui/core';
import { createTheme as createMuiTheme } from '@material-ui/core/styles';
import { softShadows } from './shadows';
import typography from './typography';
import CanelaThin from './fonts/canela/canela-thin.woff2';
import WigrumRegular from './fonts/wigrum/wigrum-regular.woff2';

const backgroundDark = '#f4f6f8';
const primaryBlue = {
  main: '#516E85',
  hover: '#4D6980',
  dark: '#374C5C',
  text: colors.blueGrey[900],
};

const canela = {
  fontFamily: 'Canela',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Canela'),
    local('Canela-Thin'),
    url(${CanelaThin}) format('woff2')
  `,
};

const wigrum = {
  fontFamily: 'Wigrum',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 500,
  src: `
    local('Wigrum'),
    local('Wigrum-Medium'),
    url(${WigrumRegular}) format('woff2')
  `,
};

const baseOptions = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [wigrum, canela],
      },
    },
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        borderRadius: '5px',
        backgroundColor: 'rgba(0,0,0,0.075)',
      },
      label: {
        lineHeight: '20px',
      },
    },
    MuiToggleButton: {
      root: {
        backgroundColor: backgroundDark,
        color: primaryBlue.text,
        '&.Mui-selected': {
          backgroundColor: primaryBlue.main,
          color: colors.common.white,
          '&:hover': {
            backgroundColor: `${primaryBlue.dark} !important`,
          },
        },
      },
    },
  },
};

const themeOverrides = {
  overrides: {
    MuiInputBase: {
      input: {
        '&::placeholder': {
          opacity: 1,
          color: colors.blueGrey[600],
        },
      },
    },
  },
  palette: {
    type: 'light',
    action: {
      active: colors.blueGrey[600],
    },
    background: {
      default: colors.common.white,
      dark: backgroundDark,
      paper: colors.common.white,
    },
    primary: {
      main: primaryBlue.main,
      hover: primaryBlue.hover,
    },
    secondary: {
      main: '#F9F2E8',
    },
    ternary: {
      main: '#1F4B4C',
    },
    success: {
      main: '#91D878',
    },
    error: {
      main: '#FA675D',
      light: '#F9D9D6',
    },
    callToAction: {
      main: '#E3BD6E',
      hover: '#A5884B',
    },
    text: {
      primary: primaryBlue.text,
      secondary: colors.blueGrey[400],
    },
  },
  shadows: softShadows,
};

export const createTheme = (config = {}) => {
  let theme = createMuiTheme(_.merge({}, baseOptions, themeOverrides));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
