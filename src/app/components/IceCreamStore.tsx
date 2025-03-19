'use client';

import { useState, useEffect } from 'react';
import { 
  getIceCreams, getGoods, updateQuantity, updateGoodQuantity,
  deleteIceCream, deleteGood, recordSale, recordGoodSale,
  type IceCream, type Item, getDrones, type Drone
} from '../../lib/db';
import { Container, Typography, Divider, SpeedDial, SpeedDialAction, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IceCreamIcon from '@mui/icons-material/Icecream';
import CandyIcon from '@mui/icons-material/Cake';
import BarChartIcon from '@mui/icons-material/BarChart';
import ItemList from './ItemList';
import AddIceCreamDialog from './AddIceCreamDialog';
import AddGoodDialog from './AddGoodDialog';
import StatsDialog from './StatsDialog';
import DroneList from './DroneList';

export default function IceCreamStore() {
  const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
  const [goods, setGoods] = useState<Item[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [isIceCreamDialogOpen, setIsIceCreamDialogOpen] = useState(false);
  const [isGoodsDialogOpen, setIsGoodsDialogOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [iceCreamData, goodsData, dronesData] = await Promise.all([
      getIceCreams(),
      getGoods(),
      getDrones()
    ]);
    setIceCreams(iceCreamData);
    setGoods(goodsData);
    setDrones(dronesData);
  }

  async function handleIceCreamDecrease(id: number, name: string, quantity: number, amount: number) {
    if (quantity <= amount) {
      await deleteIceCream(id);
      await recordSale(id, name, quantity);
    } else {
      await updateQuantity(id, quantity - amount, quantity);
      await recordSale(id, name, amount);
    }
    loadAll();
  }

  async function handleGoodDecrease(id: number, name: string, quantity: number, amount: number) {
    if (quantity <= amount) {
      await deleteGood(id);
      await recordGoodSale(id, name, quantity);
    } else {
      await updateGoodQuantity(id, quantity - amount, quantity);
      await recordGoodSale(id, name, amount);
    }
    loadAll();
  }

  async function handleIceCreamAddQuantity(id: number, name: string, currentQuantity: number, additionalQuantity: number) {
    await updateQuantity(id, currentQuantity + additionalQuantity, currentQuantity);
    loadAll();
  }

  async function handleGoodAddQuantity(id: number, name: string, currentQuantity: number, additionalQuantity: number) {
    await updateGoodQuantity(id, currentQuantity + additionalQuantity, currentQuantity);
    loadAll();
  }

  const actions = [
    { 
      icon: <IceCreamIcon />, 
      name: 'Додати морозиво',
      onClick: () => setIsIceCreamDialogOpen(true)
    },
    { 
      icon: <CandyIcon />, 
      name: 'Додати товар',
      onClick: () => setIsGoodsDialogOpen(true)
    }
  ];

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4, pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Typography variant="h4">Кіоск морозива</Typography>
        <IconButton 
          sx={{ ml: 2 }} 
          onClick={() => setIsStatsOpen(true)}
          color="primary"
        >
          <BarChartIcon />
        </IconButton>
      </Box>

      <DroneList drones={drones} onUpdate={loadAll} />

      <ItemList
        title="Морозиво"
        items={iceCreams}
        onDecrease={handleIceCreamDecrease}
        onRemoveAll={(id, name, quantity) => handleIceCreamDecrease(id, name, quantity, quantity)}
        onAdd={() => setIsIceCreamDialogOpen(true)}
        onAddQuantity={handleIceCreamAddQuantity}
        emptyIcon={<IceCreamIcon sx={{ fontSize: 60 }} />}
      />

      <Divider sx={{ my: 4 }} />

      <ItemList
        title="Додатково"
        items={goods}
        onDecrease={handleGoodDecrease}
        onRemoveAll={(id, name, quantity) => handleGoodDecrease(id, name, quantity, quantity)}
        onAdd={() => setIsGoodsDialogOpen(true)}
        onAddQuantity={handleGoodAddQuantity}
        emptyIcon={<CandyIcon sx={{ fontSize: 60 }} />}
      />

      <SpeedDial
        ariaLabel="Додати"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<AddIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      <AddIceCreamDialog
        open={isIceCreamDialogOpen}
        onClose={() => setIsIceCreamDialogOpen(false)}
        onAdd={loadAll}
      />

      <AddGoodDialog
        open={isGoodsDialogOpen}
        onClose={() => setIsGoodsDialogOpen(false)}
        onAdd={loadAll}
      />

      <StatsDialog
        open={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        onUpdate={loadAll}
      />
    </Container>
  );
} 