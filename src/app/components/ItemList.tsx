'use client';

import { Box, Button, ButtonGroup, List, ListItem, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IceCreamIcon from '@mui/icons-material/Icecream';

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
  emptyIcon?: React.ReactNode;
}

export default function ItemList({ 
  title, 
  items, 
  onDecrease, 
  onRemoveAll, 
  onAdd,
  emptyIcon = <IceCreamIcon sx={{ fontSize: 60 }} />
}: ItemListProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>

      {items.length === 0 ? (
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
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
} 