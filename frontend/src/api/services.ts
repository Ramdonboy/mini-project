import api from './axios';

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  id: number;
}

export interface Car {
  id: number;
  model: string;
  brand: string;
  type: string;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  status: string;
  ownerId?: number;
  ownerName?: string;
  description?: string;
  imageUrl?: string;
}

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  carId: number;
  carModel: string;
  carBrand: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  days: number;
}

export interface BookingSummary {
  carId: number;
  carModel: string;
  carBrand: string;
  pricePerDay: number;
  startDate: string;
  endDate: string;
  days: number;
  subtotal: number;
  tax: number;
  totalPrice: number;
}

export interface FleetDistribution {
  type: string;
  count: number;
}

export interface DashboardStats {
  totalUsers?: number;
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  fleetDistribution: FleetDistribution[];
  bookingCountByStatus?: Record<string, number>;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  register: (email: string, password: string, fullName: string, role?: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, fullName, role: role || 'USER' }),
};

export const carsApi = {
  browse: (params?: { type?: string; brand?: string; status?: string }) =>
    api.get<Car[]>('/cars/browse', { params }),
  getById: (id: number) => api.get<Car>(`/cars/${id}`),
  getMyCars: () => api.get<Car[]>('/cars/my'),
  create: (data: Partial<Car>) => api.post<Car>('/cars', data),
  update: (id: number, data: Partial<Car>) => api.put<Car>(`/cars/${id}`, data),
  delete: (id: number) => api.delete(`/cars/${id}`),
  getFleetDistribution: (ownerId?: number) =>
    api.get<FleetDistribution[]>('/cars/fleet-distribution', { params: ownerId ? { ownerId } : {} }),
};

export const bookingsApi = {
  getSummary: (carId: number, startDate: string, endDate: string) =>
    api.get<BookingSummary>('/bookings/summary', { params: { carId, startDate, endDate } }),
  create: (carId: number, startDate: string, endDate: string) =>
    api.post<Booking>('/bookings', { carId, startDate, endDate }),
  getMyBookings: () => api.get<Booking[]>('/bookings/my'),
  getOwnerBookings: (ownerId: number) =>
    api.get<Booking[]>('/bookings/owner', { params: { ownerId } }),
  updateStatus: (id: number, status: string, ownerId: number) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }, { params: { ownerId } }),
  cancel: (id: number) => api.post(`/bookings/${id}/cancel`),
};

export const adminApi = {
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard'),
  getUsers: () => api.get<User[]>('/admin/users'),
  getCars: () => api.get<Car[]>('/admin/cars'),
  getBookings: () => api.get<Booking[]>('/admin/bookings'),
};

export const ownerApi = {
  getDashboard: () => api.get<DashboardStats>('/owner/dashboard'),
};
