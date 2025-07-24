import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.users];
  }

  async getById(id) {
    await this.delay(150);
    const user = this.users.find(u => u.Id === parseInt(id) || u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await this.delay(300);
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      id: `user-${Date.now()}`,
      weeklyStreak: 0,
      joinedAt: new Date().toISOString(),
      ...userData
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await this.delay(250);
    const index = this.users.findIndex(u => u.Id === parseInt(id) || u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...userData };
    return { ...this.users[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.users.findIndex(u => u.Id === parseInt(id) || u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    const deletedUser = this.users.splice(index, 1)[0];
    return { ...deletedUser };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const userService = new UserService();