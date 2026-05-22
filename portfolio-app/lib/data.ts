import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Read data from a JSON file in the data directory
 */
export function readData<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    // Return empty array or object based on filename
    if (filename === 'profile.json' || filename === 'settings.json') {
      return {} as T;
    }
    return [] as unknown as T;
  }
}

/**
 * Write data to a JSON file in the data directory
 */
export function writeData<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Add item to a JSON array file
 */
export function addItem<T>(filename: string, item: T): T[] {
  const items = readData<T[]>(filename);
  items.push(item);
  writeData(filename, items);
  return items;
}

/**
 * Update item in a JSON array file by ID
 */
export function updateItem<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): T | null {
  const items = readData<T[]>(filename);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  writeData(filename, items);
  return items[index];
}

/**
 * Delete item from a JSON array file by ID
 */
export function deleteItem<T extends { id: string }>(
  filename: string,
  id: string
): boolean {
  const items = readData<T[]>(filename);
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeData(filename, filtered);
  return true;
}

/**
 * Get item by ID from a JSON array file
 */
export function getItemById<T extends { id: string }>(
  filename: string,
  id: string
): T | null {
  const items = readData<T[]>(filename);
  return items.find((item) => item.id === id) || null;
}
