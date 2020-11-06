import { Box } from '@material-ui/core';
import React, { ReactNode } from 'react';

interface TabPanelInterface {
  children: ReactNode;
  value: number;
  index: number;

  [key: string]: any;
}

export default function TabPanel(props: TabPanelInterface) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}
