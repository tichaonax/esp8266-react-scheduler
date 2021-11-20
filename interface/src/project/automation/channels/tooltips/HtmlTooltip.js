import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

export const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#0A25F4',
      color: 'rgba(255, 255, 255, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);