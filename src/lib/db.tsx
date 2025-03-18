import { openDB } from 'idb';

const DB_NAME = 'ice_cream_store';
const STORE_NAME = 'ice_creams';
const SALES_STORE = 'sales';
const GOODS_STORE = 'additional_goods';

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

export interface Item {
    id: number;
    name: string;
    quantity: number;
}

async function initDB() {
    return openDB(DB_NAME, 3, {
        upgrade(db, oldVersion, newVersion) {
            if (oldVersion < 1) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 2) {
                db.createObjectStore(SALES_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 3) {
                db.createObjectStore(GOODS_STORE, { keyPath: 'id', autoIncrement: true });
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

export async function getGoods(): Promise<Item[]> {
    const db = await initDB();
    return db.getAll(GOODS_STORE);
}

export async function addGood(name: string, quantity: number): Promise<IDBValidKey> {
    const db = await initDB();
    return db.add(GOODS_STORE, { name, quantity });
}

export async function updateGoodQuantity(id: number, newQuantity: number): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(GOODS_STORE, 'readwrite');
    const store = tx.objectStore(GOODS_STORE);
    const item = await store.get(id);
    if (item) {
        item.quantity = newQuantity;
        await store.put(item);
    }
}

export async function deleteGood(id: number): Promise<void> {
    const db = await initDB();
    return db.delete(GOODS_STORE, id);
}

export async function recordGoodSale(goodId: number, goodName: string, amount: number): Promise<IDBValidKey> {
    const db = await initDB();
    const sale: Sale = {
        iceCreamId: goodId,
        iceCreamName: goodName,
        amount,
        timestamp: new Date()
    };
    return db.add(SALES_STORE, sale);
}
