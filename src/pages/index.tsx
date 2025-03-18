import { useState, useEffect } from 'react';
import { getIceCreams, addIceCream, updateQuantity, deleteIceCream, type IceCream } from '../lib/db';
import { Button, TextField, List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

export default function Home() {
  const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
  const [newIceCream, setNewIceCream] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);

  useEffect(() => {
    loadIceCreams();
  }, []);

  async function loadIceCreams(): Promise<void> {
    const data = await getIceCreams();
    setIceCreams(data);
  }

  async function handleAdd(): Promise<void> {
    if (newIceCream.trim() === '' || newQuantity < 1) return;
    await addIceCream(newIceCream, newQuantity);
    setNewIceCream('');
    setNewQuantity(1);
    loadIceCreams();
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

      <TextField
        label="Назва морозива"
        value={newIceCream}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewIceCream(e.target.value)}
        sx={{ mr: 1 }}
      />
      <TextField
        type="number"
        label="Кількість"
        value={newQuantity}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewQuantity(Number(e.target.value))}
        sx={{ width: 80, mr: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>Додати</Button>

      <List sx={{ mt: 3 }}>
        {iceCreams.map(({ id, name, quantity }) => (
          <ListItem key={id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={`${name} - ${quantity} шт.`} />
            <Button variant="contained" color="secondary" onClick={() => handleSell(id, quantity)}>-</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
