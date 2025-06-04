import tripData from '../mockData/trips.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TripService {
  constructor() {
    this.data = [...tripData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const trip = this.data.find(item => item.id === id)
    return trip ? { ...trip } : null
  }

  async create(tripData) {
    await delay(400)
    const newTrip = {
      ...tripData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      imageUrl: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=400&q=80`
    }
    this.data.unshift(newTrip)
    return { ...newTrip }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new TripService()