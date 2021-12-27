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
});
