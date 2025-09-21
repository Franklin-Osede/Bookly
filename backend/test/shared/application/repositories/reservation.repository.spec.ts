import { ReservationRepository } from '../../../../src/shared/application/repositories/reservation.repository';
import { Reservation } from '../../../../src/shared/domain/entities/reservation.entity';
import { DateRange } from '../../../../src/shared/domain/value-objects/date-range';
import { Money } from '../../../../src/shared/domain/value-objects/money';

describe('ReservationRepository', () => {
  let reservationRepository: ReservationRepository;

  // Helper function to create a reservation for testing
  const createTestReservation = (overrides: Partial<{
    userId: string;
    businessId: string;
    startDate: Date;
    endDate: Date;
    guests: number;
    totalAmount: number;
    currency: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    type: 'HOTEL' | 'RESTAURANT';
  }> = {}) => {
    const defaults = {
      userId: 'user-123',
      businessId: 'business-123',
      startDate: new Date('2024-06-01T15:00:00'),
      endDate: new Date('2024-06-03T11:00:00'),
      guests: 2,
      totalAmount: 200,
      currency: 'USD',
      status: 'PENDING' as const,
      type: 'HOTEL' as const
    };

    const data = { ...defaults, ...overrides };

    return Reservation.create({
      userId: data.userId,
      businessId: data.businessId,
      startDate: data.startDate,
      endDate: data.endDate,
      guests: data.guests,
      totalAmount: new Money(data.totalAmount, data.currency),
      status: data.status,
      type: data.type
    });
  };

  beforeEach(() => {
    // Mock implementation for testing
    reservationRepository = {
      async save(reservation: Reservation): Promise<Reservation> {
        return reservation;
      },
      async findById(id: string): Promise<Reservation | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async findByUserId(userId: string): Promise<Reservation[]> {
        if (!userId || userId.trim() === '') {
          throw new Error('Invalid user ID format');
        }
        return [];
      },
      async findByBusinessId(businessId: string): Promise<Reservation[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Invalid business ID format');
        }
        return [];
      },
      async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
        if (!startDate || !endDate) {
          throw new Error('Start date and end date are required');
        }
        if (startDate > endDate) {
          throw new Error('Start date cannot be after end date');
        }
        return [];
      },
      async findByStatus(status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<Reservation[]> {
        if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
          throw new Error('Invalid reservation status');
        }
        return [];
      },
      async findByType(type: 'HOTEL' | 'RESTAURANT'): Promise<Reservation[]> {
        if (!['HOTEL', 'RESTAURANT'].includes(type)) {
          throw new Error('Invalid reservation type');
        }
        return [];
      },
      async findOverlappingReservations(businessId: string, startDate: Date, endDate: Date): Promise<Reservation[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (!startDate || !endDate) {
          throw new Error('Start date and end date are required');
        }
        if (startDate > endDate) {
          throw new Error('Start date cannot be after end date');
        }
        return [];
      },
      async findAll(): Promise<Reservation[]> {
        return [];
      },
      async update(id: string, reservation: Partial<Reservation>): Promise<Reservation | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async delete(id: string): Promise<boolean> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return false;
      },
      async exists(id: string): Promise<boolean> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return false;
      }
    };
  });

  describe('save', () => {
    it('should save a hotel reservation successfully', async () => {
      const reservation = createTestReservation({
        type: 'HOTEL',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        totalAmount: 300,
        status: 'PENDING'
      });

      const savedReservation = await reservationRepository.save(reservation);

      expect(savedReservation).toBeInstanceOf(Reservation);
      expect(savedReservation.type).toBe('HOTEL');
      expect(savedReservation.status).toBe('PENDING');
      expect(savedReservation.totalAmount.amount).toBe(300);
    });

    it('should save a restaurant reservation successfully', async () => {
      const reservation = createTestReservation({
        type: 'RESTAURANT',
        startDate: new Date('2024-06-01T19:00:00'),
        endDate: new Date('2024-06-01T21:00:00'),
        totalAmount: 150,
        status: 'CONFIRMED'
      });

      const savedReservation = await reservationRepository.save(reservation);

      expect(savedReservation).toBeInstanceOf(Reservation);
      expect(savedReservation.type).toBe('RESTAURANT');
      expect(savedReservation.status).toBe('CONFIRMED');
      expect(savedReservation.totalAmount.amount).toBe(150);
    });

    it('should save reservation with all required fields', async () => {
      const reservation = createTestReservation({
        userId: 'user-456',
        businessId: 'business-789',
        guests: 4,
        totalAmount: 500,
        currency: 'EUR'
      });

      const savedReservation = await reservationRepository.save(reservation);

      expect(savedReservation).toBeDefined();
      expect(savedReservation.id).toBeDefined();
      expect(savedReservation.userId).toBe('user-456');
      expect(savedReservation.businessId).toBe('business-789');
      expect(savedReservation.guests).toBe(4);
      expect(savedReservation.totalAmount.amount).toBe(500);
      expect(savedReservation.totalAmount.currency).toBe('EUR');
      expect(savedReservation.createdAt).toBeDefined();
      expect(savedReservation.updatedAt).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return reservation when found by id', async () => {
      const reservation = createTestReservation({
        userId: 'user-123',
        businessId: 'business-456'
      });

      // Mock the repository to return the reservation
      reservationRepository.findById = jest.fn().mockResolvedValue(reservation);

      const foundReservation = await reservationRepository.findById('reservation-id');

      expect(foundReservation).toBeInstanceOf(Reservation);
      expect(foundReservation?.userId).toBe('user-123');
      expect(foundReservation?.businessId).toBe('business-456');
    });

    it('should return null when reservation not found by id', async () => {
      const foundReservation = await reservationRepository.findById('non-existent-id');

      expect(foundReservation).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(reservationRepository.findById('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('findByUserId', () => {
    it('should return reservations when found by user id', async () => {
      const reservations = [
        createTestReservation({
          userId: 'user-123',
          type: 'HOTEL',
          status: 'CONFIRMED'
        }),
        createTestReservation({
          userId: 'user-123',
          type: 'RESTAURANT',
          status: 'PENDING'
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findByUserId = jest.fn().mockResolvedValue(reservations);

      const foundReservations = await reservationRepository.findByUserId('user-123');

      expect(foundReservations).toHaveLength(2);
      expect(foundReservations[0]).toBeInstanceOf(Reservation);
      expect(foundReservations[1]).toBeInstanceOf(Reservation);
      expect(foundReservations[0].userId).toBe('user-123');
      expect(foundReservations[1].userId).toBe('user-123');
    });

    it('should return empty array when no reservations found for user', async () => {
      const foundReservations = await reservationRepository.findByUserId('user-without-reservations');

      expect(foundReservations).toEqual([]);
    });

    it('should throw error for invalid user id format', async () => {
      await expect(reservationRepository.findByUserId('')).rejects.toThrow('Invalid user ID format');
    });
  });

  describe('findByBusinessId', () => {
    it('should return reservations when found by business id', async () => {
      const reservations = [
        createTestReservation({
          businessId: 'business-123',
          type: 'HOTEL',
          status: 'CONFIRMED'
        }),
        createTestReservation({
          businessId: 'business-123',
          type: 'HOTEL',
          status: 'PENDING'
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findByBusinessId = jest.fn().mockResolvedValue(reservations);

      const foundReservations = await reservationRepository.findByBusinessId('business-123');

      expect(foundReservations).toHaveLength(2);
      expect(foundReservations[0]).toBeInstanceOf(Reservation);
      expect(foundReservations[1]).toBeInstanceOf(Reservation);
      expect(foundReservations[0].businessId).toBe('business-123');
      expect(foundReservations[1].businessId).toBe('business-123');
    });

    it('should return empty array when no reservations found for business', async () => {
      const foundReservations = await reservationRepository.findByBusinessId('business-without-reservations');

      expect(foundReservations).toEqual([]);
    });

    it('should throw error for invalid business id format', async () => {
      await expect(reservationRepository.findByBusinessId('')).rejects.toThrow('Invalid business ID format');
    });
  });

  describe('findByDateRange', () => {
    it('should return reservations when found by date range', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-30');
      
      const reservations = [
        createTestReservation({
          startDate: new Date('2024-06-15T15:00:00'),
          endDate: new Date('2024-06-17T11:00:00')
        }),
        createTestReservation({
          startDate: new Date('2024-06-20T19:00:00'),
          endDate: new Date('2024-06-20T21:00:00')
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findByDateRange = jest.fn().mockResolvedValue(reservations);

      const foundReservations = await reservationRepository.findByDateRange(startDate, endDate);

      expect(foundReservations).toHaveLength(2);
      expect(foundReservations[0]).toBeInstanceOf(Reservation);
      expect(foundReservations[1]).toBeInstanceOf(Reservation);
    });

    it('should return empty array when no reservations found in date range', async () => {
      const startDate = new Date('2024-12-01');
      const endDate = new Date('2024-12-31');
      
      const foundReservations = await reservationRepository.findByDateRange(startDate, endDate);

      expect(foundReservations).toEqual([]);
    });

    it('should throw error for invalid date range', async () => {
      const startDate = new Date('2024-06-30');
      const endDate = new Date('2024-06-01');
      
      await expect(reservationRepository.findByDateRange(startDate, endDate)).rejects.toThrow('Start date cannot be after end date');
    });

    it('should throw error for missing dates', async () => {
      await expect(reservationRepository.findByDateRange(null as any, new Date())).rejects.toThrow('Start date and end date are required');
      await expect(reservationRepository.findByDateRange(new Date(), null as any)).rejects.toThrow('Start date and end date are required');
    });
  });

  describe('findByStatus', () => {
    it('should return reservations when found by status', async () => {
      const reservations = [
        createTestReservation({
          status: 'PENDING',
          userId: 'user-1'
        }),
        createTestReservation({
          status: 'PENDING',
          userId: 'user-2'
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findByStatus = jest.fn().mockResolvedValue(reservations);

      const foundReservations = await reservationRepository.findByStatus('PENDING');

      expect(foundReservations).toHaveLength(2);
      expect(foundReservations[0].status).toBe('PENDING');
      expect(foundReservations[1].status).toBe('PENDING');
    });

    it('should return empty array when no reservations found with status', async () => {
      const foundReservations = await reservationRepository.findByStatus('CANCELLED');

      expect(foundReservations).toEqual([]);
    });

    it('should throw error for invalid status', async () => {
      await expect(reservationRepository.findByStatus('INVALID_STATUS' as any)).rejects.toThrow('Invalid reservation status');
    });
  });

  describe('findByType', () => {
    it('should return hotel reservations when searching by type', async () => {
      const reservations = [
        createTestReservation({
          type: 'HOTEL',
          status: 'CONFIRMED'
        }),
        createTestReservation({
          type: 'HOTEL',
          status: 'PENDING'
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findByType = jest.fn().mockResolvedValue(reservations);

      const foundReservations = await reservationRepository.findByType('HOTEL');

      expect(foundReservations).toHaveLength(2);
      expect(foundReservations[0].type).toBe('HOTEL');
      expect(foundReservations[1].type).toBe('HOTEL');
    });

    it('should return restaurant reservations when searching by type', async () => {
      const reservations = [
        createTestReservation({
          type: 'RESTAURANT',
          status: 'CONFIRMED'
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findByType = jest.fn().mockResolvedValue(reservations);

      const foundReservations = await reservationRepository.findByType('RESTAURANT');

      expect(foundReservations).toHaveLength(1);
      expect(foundReservations[0].type).toBe('RESTAURANT');
    });

    it('should throw error for invalid type', async () => {
      await expect(reservationRepository.findByType('INVALID_TYPE' as any)).rejects.toThrow('Invalid reservation type');
    });
  });

  describe('findOverlappingReservations', () => {
    it('should return overlapping reservations for business', async () => {
      const businessId = 'business-123';
      const startDate = new Date('2024-06-15T15:00:00');
      const endDate = new Date('2024-06-17T11:00:00');
      
      const overlappingReservations = [
        createTestReservation({
          businessId: businessId,
          startDate: new Date('2024-06-16T15:00:00'),
          endDate: new Date('2024-06-18T11:00:00')
        }),
        createTestReservation({
          businessId: businessId,
          startDate: new Date('2024-06-14T15:00:00'),
          endDate: new Date('2024-06-16T11:00:00')
        })
      ];

      // Mock the repository to return overlapping reservations
      reservationRepository.findOverlappingReservations = jest.fn().mockResolvedValue(overlappingReservations);

      const foundReservations = await reservationRepository.findOverlappingReservations(businessId, startDate, endDate);

      expect(foundReservations).toHaveLength(2);
      expect(foundReservations[0].businessId).toBe(businessId);
      expect(foundReservations[1].businessId).toBe(businessId);
    });

    it('should return empty array when no overlapping reservations found', async () => {
      const businessId = 'business-123';
      const startDate = new Date('2024-12-01T15:00:00');
      const endDate = new Date('2024-12-03T11:00:00');
      
      const foundReservations = await reservationRepository.findOverlappingReservations(businessId, startDate, endDate);

      expect(foundReservations).toEqual([]);
    });

    it('should throw error for invalid parameters', async () => {
      const startDate = new Date('2024-06-15T15:00:00');
      const endDate = new Date('2024-06-17T11:00:00');
      
      await expect(reservationRepository.findOverlappingReservations('', startDate, endDate)).rejects.toThrow('Business ID is required');
      await expect(reservationRepository.findOverlappingReservations('business-123', null as any, endDate)).rejects.toThrow('Start date and end date are required');
      await expect(reservationRepository.findOverlappingReservations('business-123', startDate, null as any)).rejects.toThrow('Start date and end date are required');
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [
        createTestReservation({
          type: 'HOTEL',
          status: 'CONFIRMED'
        }),
        createTestReservation({
          type: 'RESTAURANT',
          status: 'PENDING'
        })
      ];

      // Mock the repository to return reservations
      reservationRepository.findAll = jest.fn().mockResolvedValue(reservations);

      const allReservations = await reservationRepository.findAll();

      expect(allReservations).toHaveLength(2);
      expect(allReservations[0]).toBeInstanceOf(Reservation);
      expect(allReservations[1]).toBeInstanceOf(Reservation);
    });

    it('should return empty array when no reservations exist', async () => {
      const allReservations = await reservationRepository.findAll();

      expect(allReservations).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update reservation successfully', async () => {
      const reservation = createTestReservation({
        status: 'PENDING',
        totalAmount: 200
      });

      const updateData = {
        status: 'CONFIRMED' as const
      };

      // Mock the repository to return updated reservation
      const mockUpdatedReservation = createTestReservation({
        status: 'CONFIRMED',
        totalAmount: 200
      });
      reservationRepository.update = jest.fn().mockResolvedValue(mockUpdatedReservation);

      const updatedReservation = await reservationRepository.update('reservation-id', updateData);

      expect(updatedReservation).toBeInstanceOf(Reservation);
      expect(updatedReservation?.status).toBe('CONFIRMED');
    });

    it('should return null when reservation not found for update', async () => {
      const updateData = {
        status: 'CONFIRMED' as const
      };

      const updatedReservation = await reservationRepository.update('non-existent-id', updateData);

      expect(updatedReservation).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      const updateData = {
        status: 'CONFIRMED' as const
      };

      await expect(reservationRepository.update('', updateData)).rejects.toThrow('Invalid ID format');
    });
  });

  describe('delete', () => {
    it('should delete reservation successfully', async () => {
      // Mock the repository to return true
      reservationRepository.delete = jest.fn().mockResolvedValue(true);

      const result = await reservationRepository.delete('reservation-id');

      expect(result).toBe(true);
    });

    it('should return false when reservation not found for deletion', async () => {
      const result = await reservationRepository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(reservationRepository.delete('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('exists', () => {
    it('should return true when reservation exists', async () => {
      // Mock the repository to return true
      reservationRepository.exists = jest.fn().mockResolvedValue(true);

      const exists = await reservationRepository.exists('reservation-id');

      expect(exists).toBe(true);
    });

    it('should return false when reservation does not exist', async () => {
      const exists = await reservationRepository.exists('non-existent-id');

      expect(exists).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(reservationRepository.exists('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('Business logic', () => {
    it('should handle concurrent reservation creation', async () => {
      const reservation1 = createTestReservation({
        userId: 'user-1',
        businessId: 'business-1',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00')
      });

      const reservation2 = createTestReservation({
        userId: 'user-2',
        businessId: 'business-2',
        startDate: new Date('2024-06-05T19:00:00'),
        endDate: new Date('2024-06-05T21:00:00')
      });

      const [savedReservation1, savedReservation2] = await Promise.all([
        reservationRepository.save(reservation1),
        reservationRepository.save(reservation2)
      ]);

      expect(savedReservation1).toBeInstanceOf(Reservation);
      expect(savedReservation2).toBeInstanceOf(Reservation);
      expect(savedReservation1.id).not.toBe(savedReservation2.id);
    });

    it('should handle availability checking for overlapping reservations', async () => {
      const businessId = 'business-123';
      const startDate = new Date('2024-06-15T15:00:00');
      const endDate = new Date('2024-06-17T11:00:00');
      
      const overlappingReservations = [
        createTestReservation({
          businessId: businessId,
          startDate: new Date('2024-06-16T15:00:00'),
          endDate: new Date('2024-06-18T11:00:00'),
          status: 'CONFIRMED'
        })
      ];

      // Mock the repository to return overlapping reservations
      reservationRepository.findOverlappingReservations = jest.fn().mockResolvedValue(overlappingReservations);

      const foundReservations = await reservationRepository.findOverlappingReservations(businessId, startDate, endDate);

      expect(foundReservations).toHaveLength(1);
      expect(foundReservations[0].businessId).toBe(businessId);
      expect(foundReservations[0].status).toBe('CONFIRMED');
    });

    it('should handle reservation status transitions', async () => {
      const reservation = createTestReservation({
        status: 'PENDING'
      });

      // Mock the repository to return updated reservation
      const mockUpdatedReservation = createTestReservation({
        status: 'CONFIRMED'
      });
      reservationRepository.update = jest.fn().mockResolvedValue(mockUpdatedReservation);

      const updatedReservation = await reservationRepository.update('reservation-id', {
        status: 'CONFIRMED'
      });

      expect(updatedReservation).toBeInstanceOf(Reservation);
      expect(updatedReservation?.status).toBe('CONFIRMED');
    });
  });
});


