'use client';

import Button from '@mui/material/Button';
import styles from "./page.module.css";
import { MouseEvent } from 'react';

export default function Home() {
  const handlePrimaryClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Primary button clicked');
  };

  const handleSecondaryClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Secondary button clicked');
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hello World</h1>
        <Button variant="contained" color="primary" onClick={handlePrimaryClick}>
          Click me
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleSecondaryClick}>
          Secondary Button
        </Button>
      </main>
    </div>
  );
}
