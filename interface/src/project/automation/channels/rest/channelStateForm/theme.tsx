import { blueGrey, green, indigo, orange, red, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    // Name of the component
    MuiPaper: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          padding: '5px',
          margin: '5px'
        },
      },
    }
  },  palette: {
    mode: "dark",
    text: {
      primary: '#fff',
      secondary: yellow[500],
    },
    primary: {
      main: '#346beb'//indigo[A400]
    },
    secondary: {
      main: blueGrey[800]
    },
    info: {
      main: indigo[500]
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
