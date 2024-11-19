export class StorageService {
  static async saveApiKey(apiKey) {
    return chrome.storage.sync.set({ apiKey });
  }

  static async getApiKey() {
    const result = await chrome.storage.sync.get(['apiKey']);
    return result.apiKey;
  }

  static async clearApiKey() {
    return chrome.storage.sync.remove(['apiKey']);
  }
}