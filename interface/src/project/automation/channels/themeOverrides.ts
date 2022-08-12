import { grey, indigo, blueGrey, orange, red, green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const MuiThemeOverride = createTheme({
  components: {
    MuiTabPanel: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          margin: '1px',
          padding: '1px'
        },
      },
    },
  },
  palette: {
    mode: "dark",
    text: {
      primary: '#fff',
      secondary: grey[500],
    },
    primary: {
      main: indigo[500]
    },
    secondary: {
      main: blueGrey[800]
    },
    info: {
      main: indigo[800]
    },
    warning: {
      main: orange[800]
    },
    error: {
      main: red[800]
    },
    success: {
      main: green[800]
    }
  }
});
