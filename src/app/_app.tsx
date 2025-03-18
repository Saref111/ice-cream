'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

export default function MyApp({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        </ThemeProvider>
    );
}
