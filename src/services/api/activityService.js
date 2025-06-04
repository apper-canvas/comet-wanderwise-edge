import activityData from '../mockData/activities.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ActivityService {
  constructor() {
    this.data = [...activityData]
  }

  async getAll() {
    await delay(280)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const activity = this.data.find(item => item.id === id)
    return activity ? { ...activity } : null
  }

  async create(activityData) {
    await delay(400)
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.data.unshift(newActivity)
    return { ...newActivity }
  }

  async update(id, updateData) {
    await delay(320)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new ActivityService()