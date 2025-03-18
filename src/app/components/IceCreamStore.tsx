'use client';

import { useState, useEffect } from 'react';
import { 
  getIceCreams, getGoods, updateQuantity, updateGoodQuantity,
  deleteIceCream, deleteGood, recordSale, recordGoodSale,
  type IceCream, type Item 
} from '../../lib/db';
import { Container, Typography, Fab, Divider, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IceCreamIcon from '@mui/icons-material/Icecream';
import CandyIcon from '@mui/icons-material/Cake';
import ItemList from './ItemList';
import AddIceCreamDialog from './AddIceCreamDialog';

export default function IceCreamStore() {
  const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
  const [goods, setGoods] = useState<Item[]>([]);
  const [isIceCreamDialogOpen, setIsIceCreamDialogOpen] = useState(false);
  const [isGoodsDialogOpen, setIsGoodsDialogOpen] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [iceCreamData, goodsData] = await Promise.all([
      getIceCreams(),
      getGoods()
    ]);
    setIceCreams(iceCreamData);
    setGoods(goodsData);
  }

  async function handleIceCreamDecrease(id: number, name: string, quantity: number, amount: number) {
    if (quantity <= amount) {
      await deleteIceCream(id);
      await recordSale(id, name, quantity);
    } else {
      await updateQuantity(id, quantity - amount);
      await recordSale(id, name, amount);
    }
    loadAll();
  }

  async function handleGoodDecrease(id: number, name: string, quantity: number, amount: number) {
    if (quantity <= amount) {
      await deleteGood(id);
      await recordGoodSale(id, name, quantity);
    } else {
      await updateGoodQuantity(id, quantity - amount);
      await recordGoodSale(id, name, amount);
    }
    loadAll();
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4, pb: 8 }}>
      <Typography variant="h4" gutterBottom>Кіоск морозива</Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <ItemList
          title="Морозиво"
          items={iceCreams}
          onDecrease={handleIceCreamDecrease}
          onRemoveAll={(id, name, quantity) => handleIceCreamDecrease(id, name, quantity, quantity)}
          onAdd={() => setIsIceCreamDialogOpen(true)}
          emptyIcon={<IceCreamIcon sx={{ fontSize: 60 }} />}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <ItemList
          title="Додатково"
          items={goods}
          onDecrease={handleGoodDecrease}
          onRemoveAll={(id, name, quantity) => handleGoodDecrease(id, name, quantity, quantity)}
          onAdd={() => setIsGoodsDialogOpen(true)}
          emptyIcon={<CandyIcon sx={{ fontSize: 60 }} />}
        />
      </Paper>

      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsIceCreamDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <AddIceCreamDialog
        open={isIceCreamDialogOpen}
        onClose={() => setIsIceCreamDialogOpen(false)}
        onAdd={loadAll}
      />

      <AddIceCreamDialog
        open={isGoodsDialogOpen}
        onClose={() => setIsGoodsDialogOpen(false)}
        onAdd={loadAll}
      />
    </Container>
  );
} 