'use client';

import Button from '@mui/material/Button';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hello World</h1>
        <Button variant="contained" color="primary">
          Click me
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary Button
        </Button>
      </main>
    </div>
  );
}
