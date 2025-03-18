'use client';

import { useState, useEffect } from 'react';
import { getIceCreams, updateQuantity, deleteIceCream, type IceCream } from '../../lib/db';
import { Button, List, ListItem, ListItemText, Container, Typography, Fab, ButtonGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIceCreamDialog from './AddIceCreamDialog';

export default function IceCreamStore() {
  const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadIceCreams();
  }, []);

  async function loadIceCreams(): Promise<void> {
    const data = await getIceCreams();
    setIceCreams(data);
  }

  async function handleDecrease(id: number, quantity: number, amount: number): Promise<void> {
    if (quantity <= amount) {
      await deleteIceCream(id);
    } else {
      await updateQuantity(id, quantity - amount);
    }
    loadIceCreams();
  }

  async function handleRemoveAll(id: number): Promise<void> {
    await deleteIceCream(id);
    loadIceCreams();
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Кіоск морозива</Typography>

      <List sx={{ mt: 3 }}>
        {iceCreams.map(({ id, name, quantity }) => (
          <ListItem 
            key={id} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1
            }}
          >
            <ListItemText primary={`${name} - ${quantity} шт.`} />
            <ButtonGroup variant="contained" size="small">
              <Button
                onClick={() => handleDecrease(id, quantity, 1)}
                sx={{ minWidth: '40px' }}
              >
                -1
              </Button>
              <Button
                onClick={() => handleDecrease(id, quantity, 2)}
                sx={{ minWidth: '40px' }}
              >
                -2
              </Button>
              <Button
                color="error"
                onClick={() => handleRemoveAll(id)}
                sx={{ minWidth: '40px' }}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          </ListItem>
        ))}
      </List>

      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <AddIceCreamDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={loadIceCreams}
      />
    </Container>
  );
} 