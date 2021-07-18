import { createTheme, Theme } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    appBar: string
  }
}

// Overwriting default components styles
const componentsOverrides = (theme: Theme) => ({
  MuiTab: {
    root: {
      backgroundColor: 'transparent',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: theme.palette.secondary,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.secondary,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.secondary,
      },
    },
  },
  MuiTabs: {
    root: {
      borderBottom: 'none',
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  },
})

const propsOverrides = {
  MuiTab: {
    disableRipple: true,
  },
}

export const lightTheme = createTheme({
  palette: {
    type: 'light',
    background: {
      default: '#ffffff',
      appBar: '#212121',
      paper: '#fff',
    },
    primary: {
      light: orange.A200,
      main: '#4086e0',
      dark: orange[800],
    },
    secondary: {
      main: '#333333',
      light: '',
      dark: '#ff',
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
})

export const darkTheme = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#303030',
      paper: '#424242',
      appBar: '#212121',
    },
    primary: {
      light: orange.A200,
      main: '#4086e0',
      dark: orange[800],
    },
    secondary: {
      main: '#1f2937',
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
})

darkTheme.overrides = componentsOverrides(darkTheme)
darkTheme.props = propsOverrides
lightTheme.overrides = componentsOverrides(lightTheme)
lightTheme.props = propsOverrides
