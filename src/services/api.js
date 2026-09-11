import axios from "axios";
import { INITIAL_CARS } from "./mockCarData";

const API_BASE_URL = "https://dummyjson.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const carService = {
  getCars: async () => {
    try {
      // ALWAYS send live HTTP GET request via Axios so call appears in browser Network tab
      const response = await api.get("/products?limit=20");

      let apiCars = [];
      if (response.data && response.data.products) {
        const brands = [
          "Tesla",
          "BMW",
          "Mercedes-Benz",
          "Audi",
          "Porsche",
          "Toyota",
          "Ford",
          "Hyundai",
        ];
        const fuels = ["Petrol", "Diesel", "Electric", "Hybrid"];
        const transmissions = ["Automatic", "Manual"];

        apiCars = response.data.products.slice(0, 10).map((p, idx) => ({
          id: `car-api-${p.id}`,
          brand: brands[idx % brands.length],
          model: p.title.split(" ")[0] || `Model ${p.id}`,
          year: 2022 + (idx % 3),
          pricePerDay: Math.round(p.price) + 40,
          fuelType: fuels[idx % fuels.length],
          transmission: transmissions[idx % transmissions.length],
          seatingCapacity: idx % 2 === 0 ? 5 : 4,
          availabilityStatus:
            idx === 1 ? "Booked" : idx === 4 ? "Maintenance" : "Available",
          image:
            p.thumbnail ||
            p.images?.[0] ||
            INITIAL_CARS[idx % INITIAL_CARS.length].image,
          description:
            p.description || "Premium rental vehicle with high performance.",
        }));
      }

      // Merge with any custom cars added or updated locally
      const customAdded = JSON.parse(
        localStorage.getItem("car_rental_custom_cars") || "[]",
      );
      const combined = [...customAdded, ...INITIAL_CARS, ...apiCars];

      // Remove duplicate IDs if any
      const uniqueCars = Array.from(
        new Map(combined.map((car) => [car.id, car])).values(),
      );
      return uniqueCars;
    } catch (err) {
      console.warn(
        "Third-party Cars API call failed, using fallback:",
        err.message,
      );
      const customAdded = JSON.parse(
        localStorage.getItem("car_rental_custom_cars") || "[]",
      );
      return [...customAdded, ...INITIAL_CARS];
    }
  },

  addCar: async (newCarData) => {
    try {
      // POST request to API
      await api.post("/products/add", {
        title: `${newCarData.brand} ${newCarData.model}`,
        price: newCarData.pricePerDay,
      });
    } catch (err) {
      console.warn("Axios POST /products/add fallback:", err.message);
    }
    const custom = JSON.parse(
      localStorage.getItem("car_rental_custom_cars") || "[]",
    );
    const updatedCustom = [newCarData, ...custom];
    localStorage.setItem(
      "car_rental_custom_cars",
      JSON.stringify(updatedCustom),
    );
  },

  saveCarsToStorage: (cars) => {
    localStorage.setItem("car_rental_custom_cars", JSON.stringify(cars));
  },
};

export const customerService = {
  getCustomers: async () => {
    try {
      // ALWAYS send live HTTP GET request via Axios so call appears in browser Network tab
      const response = await api.get("/users?limit=20");

      let apiCustomers = [];
      if (response.data && response.data.users) {
        apiCustomers = response.data.users.map((u) => ({
          id: `cust-api-${u.id}`,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          mobile: u.phone
            ? u.phone.replace(/\D/g, "").slice(-10) || `98765${10000 + u.id}`
            : `98765${10000 + u.id}`,
          address: `${u.address?.address || "101 Park Ave"}, ${u.address?.city || "New York"}, ${u.address?.state || "NY"}`,
          licenseNumber: `DL${u.id}202400${u.id}981`,
          status: "Active",
          registeredDate: u.birthDate || "2024-01-15",
        }));
      }

      // Merge with custom added customers
      const customAdded = JSON.parse(
        localStorage.getItem("car_rental_custom_customers") || "[]",
      );
      const combined = [...customAdded, ...apiCustomers];
      const uniqueCustomers = Array.from(
        new Map(combined.map((cust) => [cust.id, cust])).values(),
      );
      return uniqueCustomers;
    } catch (err) {
      console.error("Failed to fetch users from DummyJSON API:", err.message);
      return JSON.parse(
        localStorage.getItem("car_rental_custom_customers") || "[]",
      );
    }
  },

  addCustomer: async (customerData) => {
    let newId = `cust-${Date.now()}`;
    try {
      // POST to DummyJSON Users API
      const response = await api.post("/users/add", {
        firstName: customerData.name.split(" ")[0] || customerData.name,
        lastName: customerData.name.split(" ")[1] || "User",
        email: customerData.email,
        phone: customerData.mobile,
      });
      if (response.data?.id) {
        newId = `cust-api-${response.data.id}`;
      }
    } catch (err) {
      console.warn("Axios POST to DummyJSON users/add fallback:", err.message);
    }

    const newCustomer = {
      ...customerData,
      id: newId,
      status: customerData.status || "Active",
      registeredDate: new Date().toISOString().split("T")[0],
    };

    const custom = JSON.parse(
      localStorage.getItem("car_rental_custom_customers") || "[]",
    );
    localStorage.setItem(
      "car_rental_custom_customers",
      JSON.stringify([newCustomer, ...custom]),
    );
    return newCustomer;
  },

  updateCustomer: async (id, customerData) => {
    try {
      const numericId = id.replace(/\D/g, "");
      if (numericId) {
        await api.put(`/users/${numericId}`, {
          firstName: customerData.name.split(" ")[0] || customerData.name,
          email: customerData.email,
        });
      }
    } catch (err) {
      console.warn("Axios PUT to DummyJSON users/:id fallback:", err.message);
    }

    const custom = JSON.parse(
      localStorage.getItem("car_rental_custom_customers") || "[]",
    );
    const updated = custom.map((c) =>
      c.id === id ? { ...c, ...customerData } : c,
    );
    localStorage.setItem(
      "car_rental_custom_customers",
      JSON.stringify(updated),
    );
  },

  deleteCustomer: async (id) => {
    try {
      const numericId = id.replace(/\D/g, "");
      if (numericId) {
        await api.delete(`/users/${numericId}`);
      }
    } catch (err) {
      console.warn(
        "Axios DELETE to DummyJSON users/:id fallback:",
        err.message,
      );
    }

    const custom = JSON.parse(
      localStorage.getItem("car_rental_custom_customers") || "[]",
    );
    const updated = custom.filter((c) => c.id !== id);
    localStorage.setItem(
      "car_rental_custom_customers",
      JSON.stringify(updated),
    );
  },

  saveCustomersToStorage: (customers) => {
    localStorage.setItem(
      "car_rental_custom_customers",
      JSON.stringify(customers),
    );
  },
};

export const bookingService = {
  getBookings: () => {
    const stored = localStorage.getItem("car_rental_bookings");
    if (stored) {
      return JSON.parse(stored);
    }
    const initialBookings = [
      {
        id: "BK-1001",
        carId: "car-102",
        carName: "BMW M4 Competition",
        customerId: "cust-api-1",
        customerName: "Terry Medhurst",
        customerEmail: "atwitsend@google.com",
        pickupDate: "2026-09-10",
        returnDate: "2026-09-13",
        days: 3,
        pricePerDay: 150,
        totalCost: 450,
        status: "Active",
        bookedAt: "2026-09-09T10:00:00.000Z",
      },
      {
        id: "BK-1002",
        carId: "car-107",
        carName: "Ford Mustang GT",
        customerId: "cust-api-2",
        customerName: "Sheldon Quigley",
        customerEmail: "hcroft0@gmpg.org",
        pickupDate: "2026-09-08",
        returnDate: "2026-09-10",
        days: 2,
        pricePerDay: 110,
        totalCost: 220,
        status: "Completed",
        bookedAt: "2026-09-07T14:30:00.000Z",
      },
    ];
    localStorage.setItem(
      "car_rental_bookings",
      JSON.stringify(initialBookings),
    );
    return initialBookings;
  },

  saveBookingsToStorage: (bookings) => {
    localStorage.setItem("car_rental_bookings", JSON.stringify(bookings));
  },
};

export default api;
