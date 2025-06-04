import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  constructor() {
    this.data = [...userData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const user = this.data.find(item => item.id === id)
    return user ? { ...user } : null
  }

  async create(userData) {
    await delay(450)
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.data.unshift(newUser)
    return { ...newUser }
  }

  async update(id, updateData) {
    await delay(350)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('User not found')
    
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('User not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new UserService()