import mockApiData from '@/services/mockData/apis.json';

// API Service following the established service pattern
class ApiService {
  constructor() {
    this.apis = [...mockApiData];
    this.nextId = Math.max(...this.apis.map(api => api.Id), 0) + 1;
  }

  // Get all APIs
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...this.apis];
  }

  // Get API by ID
  async getById(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid API ID. Must be a positive integer.');
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    const api = this.apis.find(api => api.Id === id);
    
    if (!api) {
      throw new Error(`API with ID ${id} not found`);
    }
    
    return { ...api };
  }

  // Get APIs by category
  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.apis.filter(api => api.category === category).map(api => ({ ...api }));
  }

  // Search APIs
  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    
    return this.apis.filter(api =>
      api.name.toLowerCase().includes(searchTerm) ||
      api.description.toLowerCase().includes(searchTerm) ||
      api.growthHackRecipe.toLowerCase().includes(searchTerm) ||
      api.category.toLowerCase().includes(searchTerm)
    ).map(api => ({ ...api }));
  }

  // Add new API (for future admin functionality)
  async create(apiData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newApi = {
      ...apiData,
      Id: this.nextId++, // Auto-generate ID, ignore any provided ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.apis.push(newApi);
    return { ...newApi };
  }

  // Update API
  async update(id, updateData) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid API ID. Must be a positive integer.');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.apis.findIndex(api => api.Id === id);
    if (index === -1) {
      throw new Error(`API with ID ${id} not found`);
    }

    // Don't allow ID changes
    const { Id, ...safeUpdateData } = updateData;
    
    this.apis[index] = {
      ...this.apis[index],
      ...safeUpdateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.apis[index] };
  }

  // Delete API
  async delete(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid API ID. Must be a positive integer.');
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.apis.findIndex(api => api.Id === id);
    if (index === -1) {
      throw new Error(`API with ID ${id} not found`);
    }

    const deletedApi = { ...this.apis[index] };
    this.apis.splice(index, 1);
    
    return deletedApi;
  }

  // Get top APIs by score
  async getTopApis(scoreType = 'impact', limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const scoreField = `${scoreType}Score`;
    return [...this.apis]
      .sort((a, b) => b[scoreField] - a[scoreField])
      .slice(0, limit)
      .map(api => ({ ...api }));
  }

  // Get category statistics
  async getCategoryStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stats = {};
    this.apis.forEach(api => {
      if (!stats[api.category]) {
        stats[api.category] = {
          count: 0,
          avgImpact: 0,
          avgLeverage: 0,
          avgNovelty: 0
        };
      }
      stats[api.category].count++;
    });

    // Calculate averages
    Object.keys(stats).forEach(category => {
      const categoryApis = this.apis.filter(api => api.category === category);
      stats[category].avgImpact = categoryApis.reduce((sum, api) => sum + api.impactScore, 0) / categoryApis.length;
      stats[category].avgLeverage = categoryApis.reduce((sum, api) => sum + api.leverageScore, 0) / categoryApis.length;
      stats[category].avgNovelty = categoryApis.reduce((sum, api) => sum + api.noveltyScore, 0) / categoryApis.length;
    });

    return stats;
  }
}

// Export singleton instance
export const apiService = new ApiService();