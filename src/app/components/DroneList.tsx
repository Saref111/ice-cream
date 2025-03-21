'use client';

import { Box, Chip, Typography, IconButton, CircularProgress } from '@mui/material';
import DroneIcon from '@mui/icons-material/Air';
import AddIcon from '@mui/icons-material/Add';
import { Drone, deleteDrone } from '../../lib/db';
import { useState } from 'react';
import AddDroneDialog from './AddDroneDialog';
import EditDroneDialog from './EditDroneDialog';

interface DroneListProps {
  drones: Drone[];
  onUpdate: () => void;
  isLoading?: boolean;
}

export default function DroneList({ drones, onUpdate, isLoading }: DroneListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDrone, setEditingDrone] = useState<Drone | null>(null);

  const handleDelete = async (id: number) => {
    await deleteDrone(id);
    onUpdate();
  };

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          boxShadow: 1,
          mb: 3,
          position: 'relative'
        }}
      >
        <DroneIcon color="primary" />
        <Typography variant="subtitle1" sx={{ mr: 2 }}>Дрони:</Typography>
        {isLoading && <div style={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <CircularProgress color="inherit" />
          </div>}
        {drones.length === 0 && !isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Немає активних дронів
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
            {drones.map((drone) => (
              <Chip
                key={drone.id}
                label={`${drone.name} (${drone.amount})`}
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => setEditingDrone(drone)}
                onDelete={() => handleDelete(drone.id)}
              />
            ))}
          </Box>
        )}
        <IconButton 
          size="small" 
          onClick={() => setIsAddDialogOpen(true)}
          color="primary"
        >
          <AddIcon />
        </IconButton>
      </Box>

      <AddDroneDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={onUpdate}
      />

      <EditDroneDialog
        open={!!editingDrone}
        onClose={() => setEditingDrone(null)}
        onEdit={onUpdate}
        drone={editingDrone}
      />
    </>
  );
} 