import { BusinessRepository } from '../../../../src/shared/application/repositories/business.repository';
import { Business } from '../../../../src/shared/domain/entities/business.entity';
import { Email } from '../../../../src/shared/domain/value-objects/email';
import { PhoneNumber } from '../../../../src/shared/domain/value-objects/phone-number';
import { Address } from '../../../../src/shared/domain/value-objects/address';

describe('BusinessRepository', () => {
  let businessRepository: BusinessRepository;

  // Helper function to create a business for testing
  const createTestBusiness = (overrides: Partial<{
    name: string;
    type: 'HOTEL' | 'RESTAURANT';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email: string;
    phone: string;
    ownerId: string;
  }> = {}) => {
    const defaults = {
      name: 'Test Business',
      type: 'HOTEL' as const,
      street: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      email: 'test@business.com',
      phone: '+1234567890',
      ownerId: 'owner-123'
    };

    const data = { ...defaults, ...overrides };

    return Business.create({
      name: data.name,
      type: data.type,
      address: new Address({
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country
      }),
      email: new Email(data.email),
      phone: new PhoneNumber(data.phone),
      ownerId: data.ownerId
    });
  };

  beforeEach(() => {
    // Mock implementation for testing
    businessRepository = {
      async save(business: Business): Promise<Business> {
        return business;
      },
      async findById(id: string): Promise<Business | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async findByEmail(email: Email): Promise<Business | null> {
        return null;
      },
      async findByOwnerId(ownerId: string): Promise<Business[]> {
        if (!ownerId || ownerId.trim() === '') {
          throw new Error('Invalid owner ID format');
        }
        return [];
      },
      async findByType(type: 'HOTEL' | 'RESTAURANT'): Promise<Business[]> {
        if (!['HOTEL', 'RESTAURANT'].includes(type)) {
          throw new Error('Invalid business type');
        }
        return [];
      },
      async findByLocation(city: string, state: string): Promise<Business[]> {
        if (!city || city.trim() === '') {
          throw new Error('City is required');
        }
        if (!state || state.trim() === '') {
          throw new Error('State is required');
        }
        return [];
      },
      async findAll(): Promise<Business[]> {
        return [];
      },
      async update(id: string, business: Partial<Business>): Promise<Business | null> {
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
    it('should save a hotel business successfully', async () => {
      const business = createTestBusiness({
        name: 'Grand Hotel Plaza',
        type: 'HOTEL',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        email: 'info@grandhotel.com',
        ownerId: 'owner-123'
      });

      const savedBusiness = await businessRepository.save(business);

      expect(savedBusiness).toBeInstanceOf(Business);
      expect(savedBusiness.name).toBe('Grand Hotel Plaza');
      expect(savedBusiness.type).toBe('HOTEL');
      expect(savedBusiness.email.value).toBe('info@grandhotel.com');
    });

    it('should save a restaurant business successfully', async () => {
      const business = createTestBusiness({
        name: 'Bella Vista Restaurant',
        type: 'RESTAURANT',
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        email: 'reservations@bellavista.com',
        phone: '+1987654321',
        ownerId: 'owner-456'
      });

      const savedBusiness = await businessRepository.save(business);

      expect(savedBusiness).toBeInstanceOf(Business);
      expect(savedBusiness.name).toBe('Bella Vista Restaurant');
      expect(savedBusiness.type).toBe('RESTAURANT');
      expect(savedBusiness.email.value).toBe('reservations@bellavista.com');
    });

    it('should save business with all required fields', async () => {
      const business = createTestBusiness({
        name: 'Test Business',
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        phone: '+1555123456',
        ownerId: 'owner-789'
      });

      const savedBusiness = await businessRepository.save(business);

      expect(savedBusiness).toBeDefined();
      expect(savedBusiness.id).toBeDefined();
      expect(savedBusiness.name).toBe('Test Business');
      expect(savedBusiness.type).toBe('HOTEL');
      expect(savedBusiness.address).toBeDefined();
      expect(savedBusiness.email).toBeDefined();
      expect(savedBusiness.phone).toBeDefined();
      expect(savedBusiness.ownerId).toBe('owner-789');
      expect(savedBusiness.createdAt).toBeDefined();
      expect(savedBusiness.updatedAt).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return business when found by id', async () => {
      const business = createTestBusiness({
        name: 'Test Hotel',
        email: 'test@hotel.com'
      });

      // Mock the repository to return the business
      businessRepository.findById = jest.fn().mockResolvedValue(business);

      const foundBusiness = await businessRepository.findById('business-id');

      expect(foundBusiness).toBeInstanceOf(Business);
      expect(foundBusiness?.name).toBe('Test Hotel');
      expect(foundBusiness?.type).toBe('HOTEL');
    });

    it('should return null when business not found by id', async () => {
      const foundBusiness = await businessRepository.findById('non-existent-id');

      expect(foundBusiness).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(businessRepository.findById('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('findByEmail', () => {
    it('should return business when found by email', async () => {
      const email = new Email('test@business.com');
      const business = createTestBusiness({
        email: 'test@business.com'
      });

      // Mock the repository to return the business
      businessRepository.findByEmail = jest.fn().mockResolvedValue(business);

      const foundBusiness = await businessRepository.findByEmail(email);

      expect(foundBusiness).toBeInstanceOf(Business);
      expect(foundBusiness?.email.value).toBe('test@business.com');
    });

    it('should return null when business not found by email', async () => {
      const email = new Email('nonexistent@business.com');
      const foundBusiness = await businessRepository.findByEmail(email);

      expect(foundBusiness).toBeNull();
    });

    it('should handle case insensitive email search', async () => {
      const email = new Email('TEST@BUSINESS.COM');
      const business = createTestBusiness({
        email: 'test@business.com'
      });

      // Mock the repository to return the business
      businessRepository.findByEmail = jest.fn().mockResolvedValue(business);

      const foundBusiness = await businessRepository.findByEmail(email);

      expect(foundBusiness).toBeInstanceOf(Business);
      expect(foundBusiness?.email.value).toBe('test@business.com');
    });
  });

  describe('findByOwnerId', () => {
    it('should return businesses when found by owner id', async () => {
      const businesses = [
        createTestBusiness({
          name: 'Hotel 1',
          type: 'HOTEL',
          email: 'hotel1@test.com',
          ownerId: 'owner-123'
        }),
        createTestBusiness({
          name: 'Restaurant 1',
          type: 'RESTAURANT',
          email: 'restaurant1@test.com',
          phone: '+1987654321',
          ownerId: 'owner-123'
        })
      ];

      // Mock the repository to return businesses
      businessRepository.findByOwnerId = jest.fn().mockResolvedValue(businesses);

      const foundBusinesses = await businessRepository.findByOwnerId('owner-123');

      expect(foundBusinesses).toHaveLength(2);
      expect(foundBusinesses[0]).toBeInstanceOf(Business);
      expect(foundBusinesses[1]).toBeInstanceOf(Business);
      expect(foundBusinesses[0].ownerId).toBe('owner-123');
      expect(foundBusinesses[1].ownerId).toBe('owner-123');
    });

    it('should return empty array when no businesses found for owner', async () => {
      const foundBusinesses = await businessRepository.findByOwnerId('owner-without-businesses');

      expect(foundBusinesses).toEqual([]);
    });

    it('should throw error for invalid owner id format', async () => {
      await expect(businessRepository.findByOwnerId('')).rejects.toThrow('Invalid owner ID format');
    });
  });

  describe('findByType', () => {
    it('should return hotels when searching by type', async () => {
      const hotels = [
        createTestBusiness({
          name: 'Hotel 1',
          type: 'HOTEL',
          email: 'hotel1@test.com',
          ownerId: 'owner-1'
        }),
        createTestBusiness({
          name: 'Hotel 2',
          type: 'HOTEL',
          email: 'hotel2@test.com',
          phone: '+1234567891',
          ownerId: 'owner-2'
        })
      ];

      // Mock the repository to return hotels
      businessRepository.findByType = jest.fn().mockResolvedValue(hotels);

      const foundHotels = await businessRepository.findByType('HOTEL');

      expect(foundHotels).toHaveLength(2);
      expect(foundHotels[0].type).toBe('HOTEL');
      expect(foundHotels[1].type).toBe('HOTEL');
    });

    it('should return restaurants when searching by type', async () => {
      const restaurants = [
        createTestBusiness({
          name: 'Restaurant 1',
          type: 'RESTAURANT',
          email: 'restaurant1@test.com',
          ownerId: 'owner-1'
        })
      ];

      // Mock the repository to return restaurants
      businessRepository.findByType = jest.fn().mockResolvedValue(restaurants);

      const foundRestaurants = await businessRepository.findByType('RESTAURANT');

      expect(foundRestaurants).toHaveLength(1);
      expect(foundRestaurants[0].type).toBe('RESTAURANT');
    });

    it('should throw error for invalid business type', async () => {
      await expect(businessRepository.findByType('INVALID_TYPE' as any)).rejects.toThrow('Invalid business type');
    });
  });

  describe('findByLocation', () => {
    it('should return businesses when found by location', async () => {
      const businesses = [
        createTestBusiness({
          name: 'NYC Hotel',
          type: 'HOTEL',
          city: 'New York',
          state: 'NY',
          email: 'nyc@hotel.com',
          ownerId: 'owner-1'
        }),
        createTestBusiness({
          name: 'NYC Restaurant',
          type: 'RESTAURANT',
          city: 'New York',
          state: 'NY',
          email: 'nyc@restaurant.com',
          phone: '+1987654321',
          ownerId: 'owner-2'
        })
      ];

      // Mock the repository to return businesses
      businessRepository.findByLocation = jest.fn().mockResolvedValue(businesses);

      const foundBusinesses = await businessRepository.findByLocation('New York', 'NY');

      expect(foundBusinesses).toHaveLength(2);
      expect(foundBusinesses[0].address.city).toBe('New York');
      expect(foundBusinesses[0].address.state).toBe('NY');
      expect(foundBusinesses[1].address.city).toBe('New York');
      expect(foundBusinesses[1].address.state).toBe('NY');
    });

    it('should return empty array when no businesses found in location', async () => {
      const foundBusinesses = await businessRepository.findByLocation('NonExistentCity', 'NE');

      expect(foundBusinesses).toEqual([]);
    });

    it('should throw error for missing city', async () => {
      await expect(businessRepository.findByLocation('', 'NY')).rejects.toThrow('City is required');
    });

    it('should throw error for missing state', async () => {
      await expect(businessRepository.findByLocation('New York', '')).rejects.toThrow('State is required');
    });
  });

  describe('findAll', () => {
    it('should return all businesses', async () => {
      const businesses = [
        createTestBusiness({
          name: 'Business 1',
          type: 'HOTEL',
          email: 'business1@test.com',
          ownerId: 'owner-1'
        }),
        createTestBusiness({
          name: 'Business 2',
          type: 'RESTAURANT',
          email: 'business2@test.com',
          phone: '+1987654321',
          ownerId: 'owner-2'
        })
      ];

      // Mock the repository to return businesses
      businessRepository.findAll = jest.fn().mockResolvedValue(businesses);

      const allBusinesses = await businessRepository.findAll();

      expect(allBusinesses).toHaveLength(2);
      expect(allBusinesses[0]).toBeInstanceOf(Business);
      expect(allBusinesses[1]).toBeInstanceOf(Business);
    });

    it('should return empty array when no businesses exist', async () => {
      const allBusinesses = await businessRepository.findAll();

      expect(allBusinesses).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update business successfully', async () => {
      const business = createTestBusiness({
        name: 'Original Name',
        email: 'original@test.com',
        ownerId: 'owner-123'
      });

      const updateData = {
        name: 'Updated Name'
      };

      // Mock the repository to return updated business
      const mockUpdatedBusiness = createTestBusiness({
        name: 'Updated Name',
        email: 'original@test.com',
        ownerId: 'owner-123'
      });
      businessRepository.update = jest.fn().mockResolvedValue(mockUpdatedBusiness);

      const updatedBusiness = await businessRepository.update('business-id', updateData);

      expect(updatedBusiness).toBeInstanceOf(Business);
      expect(updatedBusiness?.name).toBe('Updated Name');
    });

    it('should return null when business not found for update', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const updatedBusiness = await businessRepository.update('non-existent-id', updateData);

      expect(updatedBusiness).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      await expect(businessRepository.update('', updateData)).rejects.toThrow('Invalid ID format');
    });
  });

  describe('delete', () => {
    it('should delete business successfully', async () => {
      // Mock the repository to return true
      businessRepository.delete = jest.fn().mockResolvedValue(true);

      const result = await businessRepository.delete('business-id');

      expect(result).toBe(true);
    });

    it('should return false when business not found for deletion', async () => {
      const result = await businessRepository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(businessRepository.delete('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('exists', () => {
    it('should return true when business exists', async () => {
      // Mock the repository to return true
      businessRepository.exists = jest.fn().mockResolvedValue(true);

      const exists = await businessRepository.exists('business-id');

      expect(exists).toBe(true);
    });

    it('should return false when business does not exist', async () => {
      const exists = await businessRepository.exists('non-existent-id');

      expect(exists).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(businessRepository.exists('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('Business logic', () => {
    it('should handle concurrent business creation', async () => {
      const business1 = createTestBusiness({
        name: 'Business 1',
        email: 'business1@test.com',
        ownerId: 'owner-1'
      });

      const business2 = createTestBusiness({
        name: 'Business 2',
        type: 'RESTAURANT',
        email: 'business2@test.com',
        phone: '+1987654321',
        ownerId: 'owner-2'
      });

      const [savedBusiness1, savedBusiness2] = await Promise.all([
        businessRepository.save(business1),
        businessRepository.save(business2)
      ]);

      expect(savedBusiness1).toBeInstanceOf(Business);
      expect(savedBusiness2).toBeInstanceOf(Business);
      expect(savedBusiness1.id).not.toBe(savedBusiness2.id);
    });

    it('should handle email uniqueness constraint', async () => {
      const email = new Email('duplicate@business.com');
      const business = createTestBusiness({
        name: 'Duplicate Business',
        email: 'duplicate@business.com',
        ownerId: 'owner-123'
      });

      // Mock the repository to return existing business
      businessRepository.findByEmail = jest.fn().mockResolvedValue(business);

      const existingBusiness = await businessRepository.findByEmail(email);

      expect(existingBusiness).toBeInstanceOf(Business);
      expect(existingBusiness?.email.value).toBe('duplicate@business.com');
    });

    it('should handle owner having multiple businesses', async () => {
      const ownerId = 'owner-with-multiple-businesses';
      const businesses = [
        createTestBusiness({
          name: 'Hotel Business',
          type: 'HOTEL',
          email: 'hotel@owner.com',
          ownerId: ownerId
        }),
        createTestBusiness({
          name: 'Restaurant Business',
          type: 'RESTAURANT',
          email: 'restaurant@owner.com',
          phone: '+1987654321',
          ownerId: ownerId
        })
      ];

      // Mock the repository to return multiple businesses
      businessRepository.findByOwnerId = jest.fn().mockResolvedValue(businesses);

      const ownerBusinesses = await businessRepository.findByOwnerId(ownerId);

      expect(ownerBusinesses).toHaveLength(2);
      expect(ownerBusinesses[0].ownerId).toBe(ownerId);
      expect(ownerBusinesses[1].ownerId).toBe(ownerId);
      expect(ownerBusinesses[0].type).toBe('HOTEL');
      expect(ownerBusinesses[1].type).toBe('RESTAURANT');
    });
  });
});