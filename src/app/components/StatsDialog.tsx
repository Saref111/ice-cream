'use client';

import { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  FormControlLabel,
  Button,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormControl,
  TextareaAutosize,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { 
  getIceCreams, getGoods, getDrones, getSales, getIncomes,
  type IceCream, type Item, type Drone, type Sale, type Income, importDatabase,
  importDatabaseFromText
} from '../../lib/db';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { saveAs } from 'file-saver';
import { useDropzone } from 'react-dropzone';

const ICECREAM_TEXT = new TextDecoder("utf-8").decode(new Uint8Array([
  208, 145, 75, 32, 208, 189, 208, 176, 32, 208, 191, 208, 190, 208, 183, 208, 184, 209, 134, 209, 150, 209, 151
]));
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
  onUpdate: () => void;
}

interface DatabaseExport {
  timestamp: string;
  iceCreams: IceCream[];
  goods: Item[];
  drones: Drone[];
  sales: Sale[];
  incomes: Income[];
}

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

const parseReport = (text: string): TextReportData => {
  const lines = text.split('\n');
  const droneData: Record<string, number> = {};
  const icecreamData: Record<string, number> = {};
  const additionalData: Record<string, number> = {};
  lines.forEach((line, index) => {
    if (line.startsWith('Дрони:')) {
      let i = index + 1;
      while (lines[i] && lines[i].startsWith('-')) {
        const [name, amount] = lines[i].replace('- ', '').split(': ');
        droneData[name] = parseInt(amount, 10);
        i++;
      }
    }
    if (line.startsWith(ICECREAM_TEXT)) {
      let i = index + 1;
      while (lines[i] && lines[i].startsWith('-')) {
        const [name, amount] = lines[i].replace('- ', '').split(': ');
        icecreamData[name] = parseInt(amount, 10);
        i++;
      }
    }
    if (line.startsWith('Додатково:')) {
      let i = index + 1;
      while (lines[i] && lines[i].startsWith('-')) {
        const [name, amount] = lines[i].replace('- ', '').split(': ');
        additionalData[name] = parseInt(amount, 10);
        i++;
      }
    }
  });

  return {
    iceCreams: Object.entries(icecreamData).map(([name, quantity]) => ({ name, quantity })),
    goods: Object.entries(additionalData).map(([name, quantity]) => ({ name, quantity })),
    drones: Object.entries(droneData).map(([name, amount]) => ({ name, amount })),
  }
}

export interface TextReportData {
  iceCreams: Omit<IceCream, 'id'>[];
  goods: Omit<Item, 'id'>[];
  drones: Omit<Drone, 'id'>[];
};

export default function StatsDialog({ open, onClose, onUpdate }: StatsDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('amount');
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
    dayjs().hour(4).minute(0).second(0)
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
    dayjs().hour(16).minute(0).second(0)
  );
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [importType, setImportType] = useState('json');
  const [currentText, setCurrentText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const generateSalesReport = async () => {
    if (!startDate || !endDate) return '';
    
    const sales = await getSales();
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startDate.toDate() && saleDate <= endDate.toDate();
    });

    if (filteredSales.length === 0) {
      return 'За вказаний період продажів не було';
    }

    const salesByItem = filteredSales.reduce((acc, sale) => {
      const key = sale.iceCreamName;
      if (!acc[key]) acc[key] = 0;
      acc[key] += sale.amount;
      return acc;
    }, {} as Record<string, number>);

    const sections = [
      `${startDate.format('DD.MM.YYYY HH:mm')} - ${endDate.format('DD.MM.YYYY HH:mm')}\n`,
      ...Object.entries(salesByItem).map(([name, amount]) => 
        `- ${name}: ${amount} шт.`
      )
    ];

    return sections.join('\n');
  };

  const generateDatabaseExport = async () => {
    const [iceCreams, goods, drones, sales, incomes] = await Promise.all([
      getIceCreams(),
      getGoods(),
      getDrones(),
      getSales(),
      getIncomes()
    ]);

    const exportData: DatabaseExport = {
      timestamp: new Date().toISOString(),
      iceCreams,
      goods,
      drones,
      sales,
      incomes
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const fileName = `icecream-store-backup-${dayjs().format('DD-MM-YYYY')}.json`;
    saveAs(blob, fileName);
  };

  const handleCopyReport = async () => {
    let report = '';
    if (reportType === 'amount') {
      report = await generateAmountReport();
    } else if (reportType === 'sales') {
      report = await generateSalesReport();
    } else if (reportType === 'database') {
      await generateDatabaseExport();
      return;
    }
    if (report) {
      await navigator.clipboard.writeText(report);
      setShowCopySuccess(true);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      const text = await file.text();
      const data: DatabaseExport = JSON.parse(text);
      
      await importDatabase(data);
      setShowCopySuccess(true);
      setImportError(null);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      setImportError('Помилка імпорту. Перевірте формат файлу.');
    }
  }, [onClose, onUpdate]);

  const onTextImport = useCallback(async () => {
    try {
      const data = parseReport(currentText);
      await importDatabaseFromText(data);
      setShowCopySuccess(true);
      setImportError(null);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      setImportError('Помилка імпорту. Перевірте формат тексту.');
    }
  }, [currentText, onClose, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1
  });

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
                  label="Звіт по залишкам" 
                />
                <FormControlLabel 
                  value="sales" 
                  control={<Radio />} 
                  label="Звіт по витратам" 
                />
                <FormControlLabel 
                  value="database" 
                  control={<Radio />} 
                  label="Експорт бази даних" 
                />
              </RadioGroup>
            </FormControl>

            {reportType === 'sales' && (
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <DateTimePicker
                    label="Початок періоду"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <DateTimePicker
                    label="Кінець періоду"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
              </LocalizationProvider>
            )}

            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyReport}
              disabled={reportType === 'sales' && (!startDate || !endDate)}
            >
              {reportType === 'database' ? 'Завантажити JSON' : 'Копіювати у буфер обміну'}
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
        <FormControl>
              <RadioGroup
                value={importType}
                onChange={(e) => setImportType(e.target.value)}
              >
                <FormControlLabel 
                  value="json" 
                  control={<Radio />} 
                  label="Імпортувати з JSON" 
                />
                <FormControlLabel 
                  value="amount" 
                  control={<Radio />} 
                  label="Імпортувати з наявного звіту" 
                />
              </RadioGroup>
            </FormControl>

          {importType === 'json' && (<Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          > 
            
            <input {...getInputProps()} />
            <UploadFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography>
              {isDragActive
                ? 'Відпустіть файл тут'
                : 'Перетягніть JSON файл сюди або клікніть для вибору'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Підтримуються файли .json
            </Typography>
          </Box>)}

          {importType === 'amount' && (
            <>
              <TextareaAutosize
                placeholder="Вставте звіт сюди"
                style={{ width: '100%', minHeight: 200, padding: 15 }}
                onChange={(e) => setCurrentText(e.target.value)}
              />
              <Button
                sx={{
                  width: '100%',
                  mt: 2
                }}
                variant="contained"
                onClick={() => onTextImport()}
              >Імпортувати</Button>
            </>
          )}
          {importError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {importError}
            </Alert>
          )}
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