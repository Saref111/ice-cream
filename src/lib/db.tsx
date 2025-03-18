import { openDB } from 'idb';

const DB_NAME = 'ice_cream_store';
const STORE_NAME = 'ice_creams';
const SALES_STORE = 'sales';

export interface IceCream {
    id: number;
    name: string;
    quantity: number;
}

export interface Sale {
    id?: number;
    iceCreamId: number;
    iceCreamName: string;
    amount: number;
    timestamp: Date;
}

async function initDB() {
    return openDB(DB_NAME, 2, {
        upgrade(db, oldVersion, newVersion) {
            if (oldVersion < 1) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 2) {
                db.createObjectStore(SALES_STORE, { keyPath: 'id', autoIncrement: true });
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

export async function recordSale(iceCreamId: number, iceCreamName: string, amount: number): Promise<IDBValidKey> {
    const db = await initDB();
    const sale: Sale = {
        iceCreamId,
        iceCreamName,
        amount,
        timestamp: new Date()
    };
    return db.add(SALES_STORE, sale);
}

export async function getSales(): Promise<Sale[]> {
    const db = await initDB();
    return db.getAll(SALES_STORE);
}
