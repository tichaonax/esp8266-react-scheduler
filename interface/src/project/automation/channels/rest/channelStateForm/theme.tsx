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
  },
});
