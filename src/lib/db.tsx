import { openDB } from 'idb';

const DB_NAME = 'ice_cream_store';
const STORE_NAME = 'ice_creams';
const SALES_STORE = 'sales';
const GOODS_STORE = 'additional_goods';
const INCOME_STORE = 'income';
const DRONES_STORE = 'drones';

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

export interface Income {
    id?: number;
    itemId: number;
    itemName: string;
    amount: number;
    quantity: number;
    timestamp: Date;
    type: 'icecream' | 'good';
}

export interface Drone {
    id: number;
    name: string;
    amount: number;
}

export interface DatabaseExport {
    timestamp: string;
    iceCreams: IceCream[];
    goods: Item[];
    drones: Drone[];
    sales: Sale[];
    incomes: Income[];
}

async function initDB() {
    return openDB(DB_NAME, 5, {
        upgrade(db, oldVersion) {
            if (oldVersion < 1) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 2) {
                db.createObjectStore(SALES_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 3) {
                db.createObjectStore(GOODS_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 4) {
                db.createObjectStore(INCOME_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (oldVersion < 5) {
                db.createObjectStore(DRONES_STORE, { keyPath: 'id', autoIncrement: true });
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
    const id = await db.add(STORE_NAME, { name, quantity });
    await recordIncome(Number(id), name, quantity, 'icecream');
    return id;
}

export async function updateQuantity(id: number, newQuantity: number, currentQuantity: number): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = await store.get(id);
    if (item) {
        item.quantity = newQuantity;
        await store.put(item);
        if (newQuantity > currentQuantity) {
            await recordIncome(id, item.name, newQuantity - currentQuantity, 'icecream');
        }
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
    const id = await db.add(GOODS_STORE, { name, quantity });
    await recordIncome(Number(id), name, quantity, 'good');
    return id;
}

export async function updateGoodQuantity(id: number, newQuantity: number, currentQuantity: number): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(GOODS_STORE, 'readwrite');
    const store = tx.objectStore(GOODS_STORE);
    const item = await store.get(id);
    if (item) {
        item.quantity = newQuantity;
        await store.put(item);
        if (newQuantity > currentQuantity) {
            await recordIncome(id, item.name, newQuantity - currentQuantity, 'good');
        }
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

export async function recordIncome(itemId: number, itemName: string, quantity: number, type: 'icecream' | 'good'): Promise<IDBValidKey> {
    const db = await initDB();
    const income: Income = {
        itemId,
        itemName,
        quantity,
        amount: 0, // You can add price logic later if needed
        timestamp: new Date(),
        type
    };
    return db.add(INCOME_STORE, income);
}

export async function getIncomes(): Promise<Income[]> {
    const db = await initDB();
    return db.getAll(INCOME_STORE);
}

export async function getDrones(): Promise<Drone[]> {
    const db = await initDB();
    return db.getAll(DRONES_STORE);
}

export async function addDrone(name: string, amount: number): Promise<IDBValidKey> {
    const db = await initDB();
    return db.add(DRONES_STORE, { name, amount });
}

export async function deleteDrone(id: number): Promise<void> {
    const db = await initDB();
    return db.delete(DRONES_STORE, id);
}

export async function updateDrone(id: number, name: string, amount: number): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(DRONES_STORE, 'readwrite');
    const store = tx.objectStore(DRONES_STORE);
    await store.put({ id, name, amount });
}

export async function clearDatabase(): Promise<void> {
    const db = await initDB();
    await Promise.all([
        db.clear(STORE_NAME),
        db.clear(SALES_STORE),
        db.clear(GOODS_STORE),
        db.clear(INCOME_STORE),
        db.clear(DRONES_STORE)
    ]);
}

export async function importDatabase(data: DatabaseExport): Promise<void> {
    const db = await initDB();
    await clearDatabase();

    const tx = db.transaction(
        [STORE_NAME, SALES_STORE, GOODS_STORE, INCOME_STORE, DRONES_STORE], 
        'readwrite'
    );

    await Promise.all([
        ...data.iceCreams.map((item: IceCream) => tx.objectStore(STORE_NAME).add(item)),
        ...data.sales.map((item: Sale) => tx.objectStore(SALES_STORE).add(item)),
        ...data.goods.map((item: Item) => tx.objectStore(GOODS_STORE).add(item)),
        ...data.incomes.map((item: Income) => tx.objectStore(INCOME_STORE).add(item)),
        ...data.drones.map((item: Drone) => tx.objectStore(DRONES_STORE).add(item))
    ]);

    await tx.done;
}
