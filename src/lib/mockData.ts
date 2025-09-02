// Mock Data Provider for Local Testing
// Replaces database calls with static data

export const mockUsers = [
  {
    id: "a877c8d6-5438-48de-a125-7c1cb5646fc3",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    permission: "admin",
    created_at: new Date().toISOString()
  },
  {
    id: "b877c8d6-5438-48de-a125-7c1cb5646fc4",
    email: "user@example.com", 
    first_name: "Regular",
    last_name: "User",
    permission: "user",
    created_at: new Date().toISOString()
  }
];

export const mockApartments = [
  {
    id: "apt-001",
    name: "Apartment 1A",
    building: "Main Building",
    consumption_data: [
      { date: "2024-01-01", heat: 150, water: 45, electricity: 320 },
      { date: "2024-01-02", heat: 145, water: 42, electricity: 315 },
      { date: "2024-01-03", heat: 160, water: 48, electricity: 340 }
    ]
  },
  {
    id: "apt-002", 
    name: "Apartment 2B",
    building: "Main Building",
    consumption_data: [
      { date: "2024-01-01", heat: 120, water: 38, electricity: 280 },
      { date: "2024-01-02", heat: 125, water: 40, electricity: 290 },
      { date: "2024-01-03", heat: 130, water: 41, electricity: 295 }
    ]
  }
];

export const mockCSVData = [
  {
    meter_id: "HEAT001",
    timestamp: "2024-01-01T00:00:00Z",
    value: 150.5,
    unit: "kWh",
    meter_type: "heat"
  },
  {
    meter_id: "WATER001", 
    timestamp: "2024-01-01T00:00:00Z",
    value: 45.2,
    unit: "m³",
    meter_type: "water"
  },
  {
    meter_id: "HEAT001",
    timestamp: "2024-01-02T00:00:00Z", 
    value: 145.8,
    unit: "kWh",
    meter_type: "heat"
  }
];

// Mock Database Functions
export const mockDb = {
  users: {
    findById: (id: string) => mockUsers.find(u => u.id === id),
    findByEmail: (email: string) => mockUsers.find(u => u.email === email),
    getAll: () => mockUsers
  },
  apartments: {
    findById: (id: string) => mockApartments.find(a => a.id === id),
    getAll: () => mockApartments,
    getByUser: (userId: string) => mockApartments // For demo, return all
  },
  consumption: {
    getByApartment: (aptId: string) => {
      const apt = mockApartments.find(a => a.id === aptId);
      return apt?.consumption_data || [];
    },
    getByDateRange: (start: string, end: string) => mockCSVData,
    getAggregated: (type: "sum" | "avg" | "min" | "max") => ({
      heat: type === "sum" ? 456.3 : type === "avg" ? 152.1 : type === "min" ? 145.8 : 160.0,
      water: type === "sum" ? 135.2 : type === "avg" ? 45.1 : type === "min" ? 38.0 : 48.0,
      electricity: type === "sum" ? 925.0 : type === "avg" ? 308.3 : type === "min" ? 280.0 : 340.0
    })
  }
};

export const isMockMode = process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true';




