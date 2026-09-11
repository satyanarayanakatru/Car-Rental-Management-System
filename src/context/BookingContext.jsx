import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { calculateRentalDays, areDateRangesOverlapping } from '../utils/dateUtils';
import { useCars } from './CarContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const { cars, updateCar } = useCars();

  useEffect(() => {
    const data = bookingService.getBookings();
    setBookings(Array.isArray(data) ? data : []);
  }, []);

  const saveAndSetBookings = (updated) => {
    setBookings(updated);
    bookingService.saveBookingsToStorage(updated);
  };

  // Conflict Checking Engine
  const isCarAvailableForDates = (carId, pickupDate, returnDate) => {
    const carList = Array.isArray(cars) ? cars : [];
    const targetCar = carList.find((c) => c.id === carId);
    if (!targetCar) return { available: false, reason: 'Car not found' };
    if (targetCar.availabilityStatus === 'Maintenance') {
      return { available: false, reason: 'Car is currently under scheduled maintenance.' };
    }

    // Check existing active bookings for overlap
    const bookingList = Array.isArray(bookings) ? bookings : [];
    const activeCarBookings = bookingList.filter(
      (b) => b.carId === carId && b.status === 'Active'
    );

    for (let b of activeCarBookings) {
      if (areDateRangesOverlapping(pickupDate, returnDate, b.pickupDate, b.returnDate)) {
        return {
          available: false,
          reason: `Car is already booked by ${b.customerName} from ${b.pickupDate} to ${b.returnDate}.`
        };
      }
    }

    return { available: true };
  };

  const createBooking = (bookingData) => {
    const { carId, customerId, customerName, customerEmail, pickupDate, returnDate } = bookingData;
    const carList = Array.isArray(cars) ? cars : [];
    const targetCar = carList.find((c) => c.id === carId);

    if (!targetCar) {
      return { success: false, message: 'Selected vehicle does not exist.' };
    }

    // Conflict Check
    const check = isCarAvailableForDates(carId, pickupDate, returnDate);
    if (!check.available) {
      return { success: false, message: check.reason };
    }

    const days = calculateRentalDays(pickupDate, returnDate);
    const totalCost = days * targetCar.pricePerDay;

    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      carId: targetCar.id,
      carName: `${targetCar.brand} ${targetCar.model}`,
      carImage: targetCar.image,
      customerId,
      customerName,
      customerEmail,
      pickupDate,
      returnDate,
      days,
      pricePerDay: targetCar.pricePerDay,
      totalCost,
      status: 'Active',
      bookedAt: new Date().toISOString()
    };

    const bookingList = Array.isArray(bookings) ? bookings : [];
    const updatedBookings = [newBooking, ...bookingList];
    saveAndSetBookings(updatedBookings);

    // Update car status in CarContext
    updateCar(targetCar.id, { availabilityStatus: 'Booked' });

    return { success: true, booking: newBooking };
  };

  const cancelBooking = (bookingId) => {
    const bookingList = Array.isArray(bookings) ? bookings : [];
    const target = bookingList.find((b) => b.id === bookingId);
    if (!target) return;

    const updated = bookingList.map((b) =>
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b
    );
    saveAndSetBookings(updated);

    // Set car back to available
    updateCar(target.carId, { availabilityStatus: 'Available' });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        cancelBooking,
        isCarAvailableForDates
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
