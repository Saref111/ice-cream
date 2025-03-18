'use client';

import { useState, useEffect } from 'react';
import { getIceCreams, updateQuantity, deleteIceCream, recordSale, type IceCream } from '../../lib/db';
import { Button, List, ListItem, ListItemText, Container, Typography, Fab, ButtonGroup, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IceCreamIcon from '@mui/icons-material/Icecream';
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

  async function handleDecrease(id: number, name: string, quantity: number, amount: number): Promise<void> {
    if (quantity <= amount) {
      await deleteIceCream(id);
      await recordSale(id, name, quantity);
    } else {
      await updateQuantity(id, quantity - amount);
      await recordSale(id, name, amount);
    }
    loadIceCreams();
  }

  async function handleRemoveAll(id: number, name: string, quantity: number): Promise<void> {
    await deleteIceCream(id);
    await recordSale(id, name, quantity);
    loadIceCreams();
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Кіоск морозива</Typography>

      {iceCreams.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            mt: 8,
            color: 'text.secondary'
          }}
        >
          <IceCreamIcon sx={{ fontSize: 60 }} />
          <Typography variant="h6">
            Немає морозива в наявності
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Додати морозиво
          </Button>
        </Box>
      ) : (
        <List sx={{ mt: 3 }}>
          {iceCreams.map(({ id, name, quantity }) => (
            <ListItem 
              key={id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                px: 3,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 'medium'
                  }}
                >
                  {quantity} шт.
                </Typography>
              </Box>
              <ButtonGroup 
                variant="contained" 
                size="small"
                sx={{ boxShadow: 2 }}
              >
                <Button
                  onClick={() => handleDecrease(id, name, quantity, 1)}
                  sx={{ minWidth: '40px' }}
                >
                  -1
                </Button>
                <Button
                  onClick={() => handleDecrease(id, name, quantity, 2)}
                  sx={{ minWidth: '40px' }}
                >
                  -2
                </Button>
                <Button
                  color="error"
                  onClick={() => handleRemoveAll(id, name, quantity)}
                  sx={{ minWidth: '40px' }}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </ListItem>
          ))}
        </List>
      )}

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