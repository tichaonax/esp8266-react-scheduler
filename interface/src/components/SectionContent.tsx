import React from 'react';

import { Paper, Typography, useTheme, useMediaQuery } from '@mui/material';

interface SectionContentProps {
  title: React.ReactNode;
  titleGutter?: boolean;
}

const SectionContent: React.FC<SectionContentProps> = (props) => {
  const { children, title, titleGutter } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Paper sx={{ p: 2, m: 3 }}>
      <Typography 
        variant={isMobile ? "subtitle1" : "h6"} 
        gutterBottom={titleGutter}
        sx={{
          fontSize: isMobile ? '0.9rem' : '1.25rem',
          fontWeight: isMobile ? 500 : 600,
          lineHeight: isMobile ? 1.3 : 1.6
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default SectionContent;
