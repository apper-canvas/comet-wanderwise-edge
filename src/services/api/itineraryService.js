import itineraryData from '../mockData/itineraries.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ItineraryService {
  constructor() {
    this.data = [...itineraryData]
  }

  async getAll() {
    await delay(250)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const itinerary = this.data.find(item => item.id === id)
    return itinerary ? { ...itinerary } : null
  }

  async create(itineraryData) {
    await delay(350)
    const newItinerary = {
      ...itineraryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.data.unshift(newItinerary)
    return { ...newItinerary }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Itinerary not found')
    
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Itinerary not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new ItineraryService()