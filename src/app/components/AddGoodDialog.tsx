'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box } from '@mui/material';
import { addGood } from '../../lib/db';
import { ChangeEvent } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface IceCreamEntry {
  name: string;
  quantity: number;
}

interface AddGoodDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddGoodDialog({ open, onClose, onAdd }: AddGoodDialogProps) {
  const [entries, setEntries] = useState<IceCreamEntry[]>([{ name: '', quantity: 0 }]);

  const handleNameChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index].name = value;
    setEntries(newEntries);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newEntries = [...entries];
    newEntries[index].quantity = value;
    setEntries(newEntries);
  };

  const addNewEntry = () => {
    setEntries([...entries, { name: '', quantity: 0 }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
    }
  };

  const handleAdd = async () => {
    const validEntries = entries.filter(entry => entry.name.trim() !== '' && entry.quantity > 0);
    if (validEntries.length === 0) return;

    for (const entry of validEntries) {
      await addGood(entry.name, entry.quantity);
    }
    
    setEntries([{ name: '', quantity: 0 }]);
    onAdd();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Додати додатковий товар</DialogTitle>
      <DialogContent>
        {entries.map((entry, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              alignItems: 'center' 
            }}
          >
            <TextField
              autoFocus={index === 0}
              label="Назва товару"
              value={entry.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChange(index, e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              type="number"
              label="Кількість"
              value={entry.quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleQuantityChange(index, Number(e.target.value))}
              sx={{ width: 100 }}
            />
            {entries.length > 1 && (
              <IconButton 
                onClick={() => removeEntry(index)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={addNewEntry}
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
        >
          Додати ще
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleAdd} variant="contained" color="primary">
          Зберегти все
        </Button>
      </DialogActions>
    </Dialog>
  );
} 