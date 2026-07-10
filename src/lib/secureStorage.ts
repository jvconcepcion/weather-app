import * as SecureStore from 'expo-secure-store';

// Supabase session tokens (especially Google OAuth) can exceed 2 KB.
// We chunk large values across multiple SecureStore keys to stay within limits.
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}_chunk_${index}`;
}
function countKey(key: string) {
  return `${key}_chunkCount`;
}

export const SecureStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    const count = await SecureStore.getItemAsync(countKey(key));
    if (count !== null) {
      const chunks: string[] = [];
      for (let i = 0; i < Number(count); i++) {
        const chunk = await SecureStore.getItemAsync(chunkKey(key, i));
        if (chunk === null) return null;
        chunks.push(chunk);
      }
      return chunks.join('');
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      await this.clearChunks(key);
    } else {
      const chunks: string[] = [];
      for (let i = 0; i < value.length; i += CHUNK_SIZE) {
        chunks.push(value.slice(i, i + CHUNK_SIZE));
      }
      for (let i = 0; i < chunks.length; i++) {
        await SecureStore.setItemAsync(chunkKey(key, i), chunks[i]);
      }
      await SecureStore.setItemAsync(countKey(key), String(chunks.length));
      await SecureStore.deleteItemAsync(key).catch(() => {});
    }
  },

  async removeItem(key: string): Promise<void> {
    const count = await SecureStore.getItemAsync(countKey(key));
    if (count !== null) {
      for (let i = 0; i < Number(count); i++) {
        await SecureStore.deleteItemAsync(chunkKey(key, i));
      }
      await SecureStore.deleteItemAsync(countKey(key));
    } else {
      await SecureStore.deleteItemAsync(key).catch(() => {});
    }
  },

  async clearChunks(key: string): Promise<void> {
    const count = await SecureStore.getItemAsync(countKey(key));
    if (count !== null) {
      for (let i = 0; i < Number(count); i++) {
        await SecureStore.deleteItemAsync(chunkKey(key, i));
      }
      await SecureStore.deleteItemAsync(countKey(key));
    }
  },
};
