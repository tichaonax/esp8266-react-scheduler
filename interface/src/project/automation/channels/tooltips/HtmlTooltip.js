import { withStyles } from "@mui/styles";
import Tooltip from '@mui/material/Tooltip';

export const HtmlTooltip = withStyles(() => ({
    tooltip: {
      backgroundColor: '#0A25F4',
      color: 'rgba(255, 255, 255, 0.87)',
      maxWidth: 220,
      fontSize: 12,
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
