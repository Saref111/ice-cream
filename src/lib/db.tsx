import { openDB } from 'idb';

const DB_NAME = 'ice_cream_store';
const STORE_NAME = 'ice_creams';

export interface IceCream {
    id: number;
    name: string;
    quantity: number;
}

async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
}

export async function getIceCreams(): Promise<IceCream[]> {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

export async function addIceCream(name: string, quantity: number): Promise<IDBValidKey> {
    const db = await initDB();
    return db.add(STORE_NAME, { name, quantity });
}

export async function updateQuantity(id: number, newQuantity: number): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = await store.get(id);
    if (item) {
        item.quantity = newQuantity;
        await store.put(item);
    }
}

export async function deleteIceCream(id: number): Promise<void> {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
}
