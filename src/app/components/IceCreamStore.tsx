'use client';

import { useState, useEffect } from 'react';
import { getIceCreams, updateQuantity, deleteIceCream, type IceCream } from '../../lib/db';
import { Button, List, ListItem, ListItemText, Container, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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

  async function handleSell(id: number, quantity: number): Promise<void> {
    if (quantity > 1) {
      await updateQuantity(id, quantity - 1);
    } else {
      await deleteIceCream(id);
    }
    loadIceCreams();
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Кіоск морозива</Typography>

      <List sx={{ mt: 3 }}>
        {iceCreams.map(({ id, name, quantity }) => (
          <ListItem key={id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={`${name} - ${quantity} шт.`} />
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => handleSell(id, quantity)}
              sx={{minHeight: '100%'}}
            >
              -
            </Button>
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