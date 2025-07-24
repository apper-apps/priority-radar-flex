import prioritiesData from "@/services/mockData/priorities.json";

class PriorityService {
  constructor() {
    this.priorities = [...prioritiesData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.priorities];
  }

  async getById(id) {
    await this.delay(150);
    const priority = this.priorities.find(p => p.Id === parseInt(id));
    if (!priority) {
      throw new Error("Priority not found");
    }
    return { ...priority };
  }

  async getByUserId(userId) {
    await this.delay(200);
    return this.priorities.filter(p => p.userId === userId).map(p => ({ ...p }));
  }

  async create(priorityData) {
    await this.delay(300);
    const newPriority = {
      Id: Math.max(...this.priorities.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString(),
      completedAt: null,
      deferredTo: null,
      deferCount: 0,
      category: null,
      ...priorityData
    };
    this.priorities.push(newPriority);
    return { ...newPriority };
  }

  async update(id, priorityData) {
    await this.delay(250);
    const index = this.priorities.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Priority not found");
    }
    this.priorities[index] = { ...this.priorities[index], ...priorityData };
    return { ...this.priorities[index] };
  }

  async complete(id) {
    await this.delay(200);
    const index = this.priorities.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Priority not found");
    }
    this.priorities[index].completedAt = new Date().toISOString();
    return { ...this.priorities[index] };
  }

  async defer(id, newDate) {
    await this.delay(200);
    const index = this.priorities.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Priority not found");
    }
    this.priorities[index].deferredTo = newDate.toISOString();
    this.priorities[index].deferCount = (this.priorities[index].deferCount || 0) + 1;
    return { ...this.priorities[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.priorities.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Priority not found");
    }
    const deletedPriority = this.priorities.splice(index, 1)[0];
    return { ...deletedPriority };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const priorityService = new PriorityService();