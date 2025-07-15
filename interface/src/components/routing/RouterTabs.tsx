
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Tabs, useMediaQuery, useTheme } from '@mui/material';

interface RouterTabsProps {
  value: string | false;
}

const RouterTabs: FC<RouterTabsProps> = ({ value, children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:400px)'); // Custom breakpoint for very small screens

  const handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    navigate(path);
  };

  // Use different tab variants based on screen size
  const getTabVariant = (): "scrollable" | "fullWidth" | "standard" => {
    if (isExtraSmall) return "scrollable";
    if (isMobile) return "fullWidth";
    return "fullWidth";
  };

  const getTabProps = () => {
    const variant = getTabVariant();
    const baseProps = {
      value,
      onChange: handleTabChange,
      variant,
      sx: {
        minHeight: 48,
        '& .MuiTabs-flexContainer': {
          width: '100%',
        },
        '& .MuiTab-root': {
          minWidth: isMobile ? 60 : 120,
          flex: isMobile ? '1' : 'none',
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          padding: isMobile ? '8px 4px' : '12px 16px',
        },
      },
    };

    if (variant === "scrollable") {
      return {
        ...baseProps,
        scrollButtons: "auto" as const,
        allowScrollButtonsMobile: true,
      };
    }

    return baseProps;
  };

  return (
    <Tabs {...getTabProps()}>
      {children}
    </Tabs>
  );
};

export default RouterTabs;
