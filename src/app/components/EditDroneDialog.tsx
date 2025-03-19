'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { updateDrone, type Drone } from '../../lib/db';
import { ChangeEvent } from 'react';

interface EditDroneDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  drone: Drone | null;
}

export default function EditDroneDialog({ open, onClose, onEdit, drone }: EditDroneDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (drone) {
      setName(drone.name);
      setAmount(drone.amount);
    }
  }, [drone]);

  const handleEdit = async () => {
    if (!drone || name.trim() === '' || amount < 1) return;
    await updateDrone(drone.id, name, amount);
    onEdit();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Редагувати дрон</DialogTitle>
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
        <Button onClick={handleEdit} variant="contained" color="primary">
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
} 