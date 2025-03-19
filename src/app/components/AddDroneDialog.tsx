'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { addDrone } from '../../lib/db';
import { ChangeEvent } from 'react';

interface AddDroneDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddDroneDialog({ open, onClose, onAdd }: AddDroneDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);

  const handleAdd = async () => {
    if (name.trim() === '' || amount < 1) return;
    await addDrone(name, amount);
    setName('');
    setAmount(0);
    onAdd();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Додати новий дрон</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Назва дрону"
          fullWidth
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <TextField
          type="number"
          margin="dense"
          label="Кількість"
          fullWidth
          value={amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleAdd} variant="contained" color="primary">
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
} 