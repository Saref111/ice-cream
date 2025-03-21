'use client';

import { Backdrop, Box, Button, ButtonGroup, CircularProgress, List, ListItem, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IceCreamIcon from '@mui/icons-material/Icecream';
import { useState } from 'react';
import AddQuantityDialog from './AddQuantityDialog';

interface Item {
  id: number;
  name: string;
  quantity: number;
}

interface ItemListProps {
  title: string;
  items: Item[];
  onDecrease: (id: number, name: string, quantity: number, amount: number) => Promise<void>;
  onRemoveAll: (id: number, name: string, quantity: number) => Promise<void>;
  onAdd: () => void;
  onAddQuantity: (id: number, name: string, currentQuantity: number, additionalQuantity: number) => Promise<void>;
  emptyIcon?: React.ReactNode;
  isLoading?: boolean;
}

export default function ItemList({ 
  title, 
  items, 
  onDecrease, 
  onRemoveAll, 
  onAdd,
  onAddQuantity,
  emptyIcon = <IceCreamIcon sx={{ fontSize: 60 }} />,
  isLoading = false,
}: ItemListProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
       
      {isLoading && (
          <CircularProgress color="inherit" />
      )
      }
      {items.length === 0 && !isLoading? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            mt: 4,
            mb: 4,
            color: 'text.secondary'
          }}
        >
          {emptyIcon}
          <Typography variant="h6">
            Немає товарів в наявності
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Додати товар
          </Button>
        </Box>
      ) : (
        <List>
          {items.map(({ id, name, quantity }) => (
            <ListItem 
              key={id} 
              sx={{ 
                display: 'flex', 
                justifyContent: {
                  xs: 'space-between',
                  sm: 'space-around'
                },
                alignItems: 'center',
                py: { xs: 1, sm: 2 },
                px: { xs: 2, sm: 2 },
                mb: 2,
                border: '1px solid',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: {xs: 2, sm: 1}, width: {xs: '130px', sm: '50%'} }}>
                <Typography variant="body1" sx={{ 
                  fontSize: {sm: 14, md: 16, xs: 12},
                  fontWeight: 500,
                  whiteSpace: 'wrap',
                  wordBreak: 'break-word',
                  width: '50%',
                  }}>
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
                    fontWeight: 'medium',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {quantity} шт.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => setSelectedItem({ id, name, quantity })}
                  sx={{ minWidth: '40px' }}
                >
                  <AddIcon fontSize="small" />
                </Button>
                <ButtonGroup 
                  variant="contained" 
                  size="small"
                  sx={{ boxShadow: 2 }}
                >
                  <Button
                    onClick={() => onDecrease(id, name, quantity, 1)}
                    sx={{ minWidth: '40px' }}
                  >
                    -1
                  </Button>
                  <Button
                    onClick={() => onDecrease(id, name, quantity, 2)}
                    sx={{ minWidth: '40px' }}
                  >
                    -2
                  </Button>
                  <Button
                    color="error"
                    onClick={() => onRemoveAll(id, name, quantity)}
                    sx={{ minWidth: '40px' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </ButtonGroup>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <AddQuantityDialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdd={async (quantity) => {
          if (selectedItem) {
            await onAddQuantity(selectedItem.id, selectedItem.name, selectedItem.quantity, quantity);
          }
        }}
        itemName={selectedItem?.name || ''}
        currentQuantity={selectedItem?.quantity || 0}
      />
    </Box>
  );
} 