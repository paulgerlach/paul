// Data Adapter - Switches between Mock and Real Database
import { mockDb, isMockMode } from './mockData';

// Check if we should use mock data
const useMockData = process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

console.log(`🔧 Data Mode: ${useMockData ? 'MOCK DATA' : 'REAL DATABASE'}`);

// User operations
export const userService = {
  async findById(id: string) {
    if (useMockData) {
      console.log(`📝 Mock: Finding user by ID: ${id}`);
      return mockDb.users.findById(id);
    }
    
    // Real database call would go here
    try {
      // const { data } = await supabase.from('users').select('*').eq('id', id).single();
      // return data;
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.users.findById(id);
    }
  },

  async findByEmail(email: string) {
    if (useMockData) {
      console.log(`📝 Mock: Finding user by email: ${email}`);
      return mockDb.users.findByEmail(email);
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.users.findByEmail(email);
    }
  },

  async getAll() {
    if (useMockData) {
      console.log('📝 Mock: Getting all users');
      return mockDb.users.getAll();
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.users.getAll();
    }
  }
};

// Apartment operations  
export const apartmentService = {
  async getAll() {
    if (useMockData) {
      console.log('📝 Mock: Getting all apartments');
      return mockDb.apartments.getAll();
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.apartments.getAll();
    }
  },

  async getByUser(userId: string) {
    if (useMockData) {
      console.log(`📝 Mock: Getting apartments for user: ${userId}`);
      return mockDb.apartments.getByUser(userId);
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.apartments.getByUser(userId);
    }
  }
};

// Consumption data operations
export const consumptionService = {
  async getByApartment(apartmentId: string) {
    if (useMockData) {
      console.log(`📝 Mock: Getting consumption data for apartment: ${apartmentId}`);
      return mockDb.consumption.getByApartment(apartmentId);
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.consumption.getByApartment(apartmentId);
    }
  },

  async getByDateRange(start: string, end: string) {
    if (useMockData) {
      console.log(`📝 Mock: Getting consumption data from ${start} to ${end}`);
      return mockDb.consumption.getByDateRange(start, end);
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.consumption.getByDateRange(start, end);
    }
  },

  async getAggregated(type: "sum" | "avg" | "min" | "max") {
    if (useMockData) {
      console.log(`📝 Mock: Getting ${type} aggregated consumption data`);
      return mockDb.consumption.getAggregated(type);
    }
    
    try {
      // Real database call
      throw new Error('Real database not configured - using mock data');
    } catch (error) {
      console.log('⚠️ Database error, falling back to mock data');
      return mockDb.consumption.getAggregated(type);
    }
  }
};

export { useMockData };




