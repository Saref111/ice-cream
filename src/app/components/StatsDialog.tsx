'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getIceCreams, getGoods, getDrones } from '../../lib/db';

const ICECREAM_TEXT = String.fromCharCode(
  66, 75, 32, 208, 189, 208, 176, 32, 208, 191, 208, 190, 208, 183, 208, 184, 209, 134, 209, 150, 209, 151
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
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
  const [reportType, setReportType] = useState('amount');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const generateAmountReport = async () => {
    const [iceCreams, goods, drones] = await Promise.all([
      getIceCreams(),
      getGoods(),
      getDrones()
    ]);

    const currentDate = new Date().toLocaleDateString('uk-UA');
    const sections: string[] = [currentDate];
    
    if (drones.length > 0) {
      const dronesReport = drones.map(drone => 
        `- ${drone.name}: ${drone.amount} шт.`
      ).join('\n');
      sections.push(`Дрони:\n${dronesReport}`);
    }

    if (iceCreams.length > 0) {
      const iceCreamReport = iceCreams.map(ice => 
        `- ${ice.name}: ${ice.quantity} шт.`
      ).join('\n');
      sections.push(`${ICECREAM_TEXT}:\n${iceCreamReport}`);
    }

    if (goods.length > 0) {
      const goodsReport = goods.map(good => 
        `- ${good.name}: ${good.quantity} шт.`
      ).join('\n');
      sections.push(`Додатково:\n${goodsReport}`);
    }

    return sections.join('\n\n');
  };

  const handleCopyReport = async () => {
    if (reportType === 'amount') {
      const report = await generateAmountReport();
      await navigator.clipboard.writeText(report);
      setShowCopySuccess(true);
    }
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <RadioGroup
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <FormControlLabel 
                  value="amount" 
                  control={<Radio />} 
                  label="Звіт по кількості" 
                />
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyReport}
              disabled={reportType === 'none'}
            >
              Копіювати у буфер обміну
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Імпорт даних
        </TabPanel>
      </DialogContent>
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Звіт скопійовано у буфер обміну
        </Alert>
      </Snackbar>
    </Dialog>
  );
} 