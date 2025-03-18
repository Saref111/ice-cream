'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { ChangeEvent } from 'react';

interface AddQuantityDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (quantity: number) => Promise<void>;
  itemName: string;
  currentQuantity: number;
}

export default function AddQuantityDialog({ 
  open, 
  onClose, 
  onAdd, 
  itemName,
  currentQuantity 
}: AddQuantityDialogProps) {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = async () => {
    if (quantity > 0) {
      await onAdd(quantity);
      setQuantity(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Додати кількість до {itemName}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Додаткова кількість"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
          helperText={`Поточна кількість: ${currentQuantity}`}
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