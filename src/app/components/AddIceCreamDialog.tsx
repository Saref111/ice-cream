'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { addIceCream } from '../../lib/db';
import { ChangeEvent } from 'react';

interface AddIceCreamDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddIceCreamDialog({ open, onClose, onAdd }: AddIceCreamDialogProps) {
  const [newIceCream, setNewIceCream] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);

  const handleAdd = async () => {
    if (newIceCream.trim() === '' || newQuantity < 1) return;
    await addIceCream(newIceCream, newQuantity);
    setNewIceCream('');
    setNewQuantity(0);
    onAdd();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Додати нове морозиво</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Назва морозива"
          fullWidth
          value={newIceCream}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewIceCream(e.target.value)}
        />
        <TextField
          type="number"
          margin="dense"
          label="Кількість"
          fullWidth
          value={newQuantity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewQuantity(Number(e.target.value))}
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