import axios from 'axios';
import { INITIAL_CARS } from './mockCarData';
import { INITIAL_CUSTOMERS } from './mockCustomerData';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const carService = {
  getCars: async () => {
    // Check local storage for user modifications
    const stored = localStorage.getItem('car_rental_cars');
    if (stored) {
      return JSON.parse(stored);
    }

    try {
      // Fetch live Third-Party API data via Axios
      const response = await api.get('/products?limit=20');
      if (response.data && response.data.products) {
        const brands = ['Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Toyota', 'Ford', 'Hyundai'];
        const fuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
        const transmissions = ['Automatic', 'Manual'];

        const apiCars = response.data.products.slice(0, 10).map((p, idx) => ({
          id: `car-api-${p.id}`,
          brand: brands[idx % brands.length],
          model: p.title.split(' ')[0] || `Model ${p.id}`,
          year: 2022 + (idx % 3),
          pricePerDay: Math.round(p.price) + 40,
          fuelType: fuels[idx % fuels.length],
          transmission: transmissions[idx % transmissions.length],
          seatingCapacity: idx % 2 === 0 ? 5 : 4,
          availabilityStatus: idx === 1 ? 'Booked' : idx === 4 ? 'Maintenance' : 'Available',
          image: p.thumbnail || p.images?.[0] || INITIAL_CARS[idx % INITIAL_CARS.length].image,
          description: p.description || 'Premium rental vehicle with high performance.'
        }));

        const combined = [...INITIAL_CARS, ...apiCars];
        localStorage.setItem('car_rental_cars', JSON.stringify(combined));
        return combined;
      }
    } catch (err) {
      console.warn('Third-party API call failed, loading seed fleet:', err.message);
    }

    localStorage.setItem('car_rental_cars', JSON.stringify(INITIAL_CARS));
    return INITIAL_CARS;
  },

  saveCarsToStorage: (cars) => {
    localStorage.setItem('car_rental_cars', JSON.stringify(cars));
  }
};

export const customerService = {
  getCustomers: async () => {
    const stored = localStorage.getItem('car_rental_customers');
    if (stored) {
      return JSON.parse(stored);
    }

    try {
      // Fetch live third-party users via Axios
      const response = await api.get('/users?limit=10');
      if (response.data && response.data.users) {
        const apiCustomers = response.data.users.map((u) => ({
          id: `cust-api-${u.id}`,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          address: `${u.address?.address || '123 Main St'}, ${u.address?.city || 'City'}`,
          licenseNumber: `DL${u.id}202200${u.id}981`,
          status: 'Active',
          registeredDate: '2024-01-10'
        }));

        const combined = [...INITIAL_CUSTOMERS, ...apiCustomers];
        localStorage.setItem('car_rental_customers', JSON.stringify(combined));
        return combined;
      }
    } catch (err) {
      console.warn('Third-party Users API failed, loading seed customers:', err.message);
    }

    localStorage.setItem('car_rental_customers', JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  },

  saveCustomersToStorage: (customers) => {
    localStorage.setItem('car_rental_customers', JSON.stringify(customers));
  }
};

export const bookingService = {
  getBookings: () => {
    const stored = localStorage.getItem('car_rental_bookings');
    if (stored) {
      return JSON.parse(stored);
    }
    const initialBookings = [
      {
        id: 'BK-1001',
        carId: 'car-102',
        carName: 'BMW M4 Competition',
        customerId: 'cust-1',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul.sharma@example.com',
        pickupDate: '2026-09-10',
        returnDate: '2026-09-13',
        days: 3,
        pricePerDay: 150,
        totalCost: 450,
        status: 'Active',
        bookedAt: '2026-09-09T10:00:00.000Z'
      },
      {
        id: 'BK-1002',
        carId: 'car-107',
        carName: 'Ford Mustang GT',
        customerId: 'cust-2',
        customerName: 'Priya Patel',
        customerEmail: 'priya.p@example.com',
        pickupDate: '2026-09-08',
        returnDate: '2026-09-10',
        days: 2,
        pricePerDay: 110,
        totalCost: 220,
        status: 'Completed',
        bookedAt: '2026-09-07T14:30:00.000Z'
      }
    ];
    localStorage.setItem('car_rental_bookings', JSON.stringify(initialBookings));
    return initialBookings;
  },

  saveBookingsToStorage: (bookings) => {
    localStorage.setItem('car_rental_bookings', JSON.stringify(bookings));
  }
};

export default api;
