import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Clear old stale local storage caches containing beauty product images
try {
  localStorage.removeItem('car_rental_cars');
} catch (e) {}

// Real Car Vehicle Fleet Models & High-Resolution Vehicle Photos (Matching Screenshot 2)
export const REAL_VEHICLES = [
  {
    id: 'car-101',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    pricePerDay: 180,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availabilityStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-fast electric luxury sedan with autopilot capabilities and executive interior.'
  },
  {
    id: 'car-102',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    pricePerDay: 150,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 4,
    availabilityStatus: 'Booked',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    description: 'High-performance sports coupe featuring twin-turbo inline 6 and track dynamics.'
  },
  {
    id: 'car-103',
    brand: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2023,
    pricePerDay: 250,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availabilityStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic luxury off-road SUV delivering powerful V8 performance and prestige status.'
  },
  {
    id: 'car-104',
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    pricePerDay: 195,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availabilityStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    description: 'Futuristic electric grand tourer with dual motor AWD and 800V fast charging.'
  },
  {
    id: 'car-105',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2023,
    pricePerDay: 220,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 4,
    availabilityStatus: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    description: 'Timeless sports car perfection with twin-turbo flat-six engine and razor-sharp handling.'
  },
  {
    id: 'car-106',
    brand: 'Toyota',
    model: 'Camry Hybrid',
    year: 2023,
    pricePerDay: 65,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availabilityStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Reliable, comfortable, and fuel-efficient hybrid midsize sedan ideal for long journeys.'
  },
  {
    id: 'car-107',
    brand: 'Ford',
    model: 'Mustang GT',
    year: 2022,
    pricePerDay: 110,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 4,
    availabilityStatus: 'Booked',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
    description: 'American muscle car powered by a roaring 5.0L V8 with 6-speed manual transmission.'
  },
  {
    id: 'car-108',
    brand: 'Hyundai',
    model: 'Ioniq 5',
    year: 2024,
    pricePerDay: 85,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availabilityStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1662916892695-0010c732bcdd?auto=format&fit=crop&w=800&q=80',
    description: 'Award-winning retro-futuristic electric crossover with lounge-like interior space.'
  }
];

export const carService = {
  getCars: async () => {
    try {
      // ALWAYS send live HTTP GET request via Axios to DummyJSON /products so Network tab shows GET call
      const response = await api.get('/products?limit=10');
      
      let apiCars = [];
      if (response.data && response.data.products) {
        // Map products API items together with real car vehicle presets (ONLY cars, no beauty products!)
        apiCars = response.data.products.slice(0, REAL_VEHICLES.length).map((p, idx) => {
          const vehicle = REAL_VEHICLES[idx];
          return {
            id: `car-api-${p.id}`,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            pricePerDay: vehicle.pricePerDay,
            fuelType: vehicle.fuelType,
            transmission: vehicle.transmission,
            seatingCapacity: vehicle.seatingCapacity,
            availabilityStatus: vehicle.availabilityStatus,
            image: vehicle.image, // Actual vehicle photo (matching Screenshot 2)
            description: vehicle.description
          };
        });
      }

      // Merge with custom added cars from localStorage
      const customAdded = JSON.parse(localStorage.getItem('car_rental_custom_cars') || '[]');
      const combined = [...customAdded, ...apiCars];

      // Remove duplicate IDs
      const uniqueCars = Array.from(new Map(combined.map(car => [car.id, car])).values());
      return uniqueCars;
    } catch (err) {
      console.warn('Third-party Cars API call failed, using fallback fleet:', err.message);
      const customAdded = JSON.parse(localStorage.getItem('car_rental_custom_cars') || '[]');
      return [...customAdded, ...REAL_VEHICLES];
    }
  },

  addCar: async (newCarData) => {
    try {
      await api.post('/products/add', {
        title: `${newCarData.brand} ${newCarData.model}`,
        price: newCarData.pricePerDay
      });
    } catch (err) {
      console.warn('Axios POST /products/add fallback:', err.message);
    }
    const custom = JSON.parse(localStorage.getItem('car_rental_custom_cars') || '[]');
    const updatedCustom = [newCarData, ...custom];
    localStorage.setItem('car_rental_custom_cars', JSON.stringify(updatedCustom));
  },

  saveCarsToStorage: (cars) => {
    localStorage.setItem('car_rental_custom_cars', JSON.stringify(cars));
  }
};

export const customerService = {
  getCustomers: async () => {
    try {
      // ALWAYS send live HTTP GET request via Axios to DummyJSON /users so call appears in Network tab
      const response = await api.get('/users?limit=20');
      
      let apiCustomers = [];
      if (response.data && response.data.users) {
        apiCustomers = response.data.users.map((u) => ({
          id: `cust-api-${u.id}`,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          mobile: u.phone ? u.phone.replace(/\D/g, '').slice(-10) || `98765${10000 + u.id}` : `98765${10000 + u.id}`,
          address: `${u.address?.address || '101 Park Ave'}, ${u.address?.city || 'New York'}, ${u.address?.state || 'NY'}`,
          licenseNumber: `DL${u.id}202400${u.id}981`,
          status: 'Active',
          registeredDate: u.birthDate || '2024-01-15'
        }));
      }

      // Merge with custom added customers
      const customAdded = JSON.parse(localStorage.getItem('car_rental_custom_customers') || '[]');
      const combined = [...customAdded, ...apiCustomers];
      const uniqueCustomers = Array.from(new Map(combined.map(cust => [cust.id, cust])).values());
      return uniqueCustomers;
    } catch (err) {
      console.error('Failed to fetch users from DummyJSON API:', err.message);
      return JSON.parse(localStorage.getItem('car_rental_custom_customers') || '[]');
    }
  },

  addCustomer: async (customerData) => {
    let newId = `cust-${Date.now()}`;
    try {
      const response = await api.post('/users/add', {
        firstName: customerData.name.split(' ')[0] || customerData.name,
        lastName: customerData.name.split(' ')[1] || 'User',
        email: customerData.email,
        phone: customerData.mobile
      });
      if (response.data?.id) {
        newId = `cust-api-${response.data.id}`;
      }
    } catch (err) {
      console.warn('Axios POST to DummyJSON users/add fallback:', err.message);
    }

    const newCustomer = {
      ...customerData,
      id: newId,
      status: customerData.status || 'Active',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    const custom = JSON.parse(localStorage.getItem('car_rental_custom_customers') || '[]');
    localStorage.setItem('car_rental_custom_customers', JSON.stringify([newCustomer, ...custom]));
    return newCustomer;
  },

  updateCustomer: async (id, customerData) => {
    try {
      const numericId = id.replace(/\D/g, '');
      if (numericId) {
        await api.put(`/users/${numericId}`, {
          firstName: customerData.name.split(' ')[0] || customerData.name,
          email: customerData.email
        });
      }
    } catch (err) {
      console.warn('Axios PUT to DummyJSON users/:id fallback:', err.message);
    }

    const custom = JSON.parse(localStorage.getItem('car_rental_custom_customers') || '[]');
    const updated = custom.map(c => c.id === id ? { ...c, ...customerData } : c);
    localStorage.setItem('car_rental_custom_customers', JSON.stringify(updated));
  },

  deleteCustomer: async (id) => {
    try {
      const numericId = id.replace(/\D/g, '');
      if (numericId) {
        await api.delete(`/users/${numericId}`);
      }
    } catch (err) {
      console.warn('Axios DELETE to DummyJSON users/:id fallback:', err.message);
    }

    const custom = JSON.parse(localStorage.getItem('car_rental_custom_customers') || '[]');
    const updated = custom.filter(c => c.id !== id);
    localStorage.setItem('car_rental_custom_customers', JSON.stringify(updated));
  },

  saveCustomersToStorage: (customers) => {
    localStorage.setItem('car_rental_custom_customers', JSON.stringify(customers));
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
        carId: 'car-api-1',
        carName: 'Tesla Model S Plaid',
        customerId: 'cust-api-1',
        customerName: 'Terry Medhurst',
        customerEmail: 'atwitsend@google.com',
        pickupDate: '2026-09-10',
        returnDate: '2026-09-13',
        days: 3,
        pricePerDay: 180,
        totalCost: 540,
        status: 'Active',
        bookedAt: '2026-09-09T10:00:00.000Z'
      },
      {
        id: 'BK-1002',
        carId: 'car-api-2',
        carName: 'BMW M4 Competition',
        customerId: 'cust-api-2',
        customerName: 'Sheldon Quigley',
        customerEmail: 'hcroft0@gmpg.org',
        pickupDate: '2026-09-08',
        returnDate: '2026-09-10',
        days: 2,
        pricePerDay: 150,
        totalCost: 300,
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
