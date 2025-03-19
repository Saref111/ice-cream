'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface StatsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function StatsDialog({ open, onClose }: StatsDialogProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Статистика та дані</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<DownloadIcon />} label="Експорт" />
            <Tab icon={<UploadIcon />} label="Імпорт" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          Експорт даних
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Імпорт даних
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
} 